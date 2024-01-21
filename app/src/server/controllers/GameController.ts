import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import GameModel from "@/server/models/GameModel";
import PlayerModel from "@/server/models/PlayerModel";
import { BoardLocation } from "@/types/board";
import { PlayerStatus } from "@/types/player";
import {
  ClientToServerEvents,
  ServerToClientEventName,
  ServerToClientEvents,
} from "@/types/socket";

const MAX_PLAYERS = 16;
const INITIAL_TILE_COUNT = 21;
const INITIAL_SHORTENED_GAME_TILE_COUNT = 2;

export default class GameController {
  private static games: Record<string, GameModel> = {};

  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private socket: Socket<ClientToServerEvents, ServerToClientEvents>;
  private currentGame: GameModel;
  private currentPlayer: PlayerModel;

  constructor(
    io: Server,
    socket: Socket,
    currentGame: GameModel,
    currentPlayer: PlayerModel,
  ) {
    this.io = io;
    this.socket = socket;
    this.currentGame = currentGame;
    this.currentPlayer = currentPlayer;
  }

  private emitFrom(includeCurrentUser: boolean) {
    return includeCurrentUser ? this.io : this.socket;
  }

  emitNotification(
    to: string,
    message: string,
    includeCurrentUser: boolean,
  ): void {
    this.emitFrom(includeCurrentUser)
      .to(to)
      .emit(ServerToClientEventName.Notification, { message });
  }

  emitGameInfo(includeCurrentUser: boolean): void {
    this.emitFrom(includeCurrentUser)
      .to(this.currentGame.getId())
      .emit(ServerToClientEventName.GameInfo, this.currentGame.toJSON());
  }

  static getGames(): Record<string, GameModel> {
    return { ...this.games };
  }

  static createGame(
    gameName: string,
    username: string,
    isShortenedGame: boolean,
    io: Server,
    socket: Socket,
  ): GameController {
    let gameId: string;

    do {
      gameId = randomUUID();
    } while (this.games[gameId]);

    const game = new GameModel(gameId, gameName, isShortenedGame);
    this.games = {
      ...this.games,
      [gameId]: game,
    };

    return this.joinGame(gameId, username, false, io, socket);
  }

  static joinGame(
    gameId: string,
    username: string,
    isSpectator: boolean,
    io: Server,
    socket: Socket,
  ): GameController {
    const game = this.games[gameId];

    if (!game) {
      throw new Error("Game does not exist");
    }

    if (game.isShortenedGame() && game.getPlayers().length > 0) {
      throw new Error(
        "This game was created for test purposes and cannot be joined.",
      );
    }

    if (game.getPlayers().length >= MAX_PLAYERS) {
      throw new Error("Game is full");
    }

    const isAdmin = game.getPlayers().length === 0;
    const player = new PlayerModel(
      socket.id,
      username,
      isSpectator || game.isInProgress()
        ? PlayerStatus.SPECTATING
        : PlayerStatus.NOT_READY,
      isAdmin,
    );

    game.addPlayer(player);
    void socket.join(gameId);

    const gameContoller = new GameController(io, socket, game, player);

    gameContoller.emitNotification(
      gameId,
      `${username} has joined the game!`,
      false,
    );
    gameContoller.emitGameInfo(false);

    return gameContoller;
  }

  getCurrentGame(): GameModel {
    return this.currentGame;
  }

  getCurrentPlayer(): PlayerModel {
    return this.currentPlayer;
  }

  kickPlayer(userId: string): void {
    if (!this.currentPlayer.isAdmin()) {
      throw new Error("Only game admins can kick players from the game");
    }

    this.io.sockets.sockets.get(userId)?.disconnect(true);
  }

  leaveGame(): void {
    const { socket, currentPlayer, currentGame } = this;

    const gameId = currentGame.getId();

    currentGame.removePlayer(currentPlayer.getUserId());
    void socket.leave(gameId);

    this.emitNotification(
      gameId,
      `${currentPlayer.getUsername()} has left the game.`,
      false,
    );

    if (currentPlayer.isAdmin()) {
      currentGame.getPlayers()[0]?.setAdmin(true);
    }

    if (currentGame.getPlayers().length === 0) {
      const { [gameId]: toOmit, ...rest } = GameController.games;
      GameController.games = rest;
    } else if (
      currentGame.isInProgress() &&
      currentGame.getActivePlayers().length === 0
    ) {
      currentGame.setInProgress(false);
      this.emitNotification(
        gameId,
        "All active players have left, resetting game",
        false,
      );
      this.emitGameInfo(false);
    } else {
      this.emitGameInfo(false);
    }
  }

  setStatus(status: PlayerStatus): void {
    const { currentGame, currentPlayer } = this;

    if (currentPlayer.getStatus() === status) {
      return;
    }

    if (currentGame.isInProgress() && status === PlayerStatus.READY) {
      throw new Error("Cannot switch to ready while a game is in progress");
    }

    currentPlayer.setStatus(status);

    if (currentGame.isInProgress() && status === PlayerStatus.SPECTATING) {
      this.emitNotification(
        currentGame.getId(),
        `${currentPlayer.getUsername()} has switched to a spectator`,
        false,
      );
    }

    if (
      currentGame.isInProgress() &&
      currentGame.getActivePlayers().length === 0
    ) {
      this.emitNotification(
        currentGame.getId(),
        "No active players remain, resetting game",
        true,
      );

      currentGame.setInProgress(false);
    }

    this.emitGameInfo(true);
  }

  peel(): void {
    const { currentPlayer, currentGame } = this;
    const currentActivePlayers = currentGame.getActivePlayers();
    const currentPlayers = currentGame.getPlayers();

    if (currentPlayer.getHand().getTiles().length > 0) {
      return;
    }

    if (
      currentGame.getBunch().getTiles().length < currentActivePlayers.length
    ) {
      this.emitNotification(
        currentGame.getId(),
        `Game is over, ${currentPlayer.getUsername()} won.`,
        false,
      );

      this.emitNotification(
        currentPlayer.getUserId(),
        "Game is over, you won!",
        true,
      );

      currentGame.setInProgress(false);

      currentPlayers.forEach((player) => {
        if (player.getStatus() !== PlayerStatus.SPECTATING) {
          player.setStatus(PlayerStatus.NOT_READY);
        }

        player.setTopBanana(player.getUserId() === currentPlayer.getUserId());
        if (player.getUserId() === currentPlayer.getUserId()) {
          player.incrementGamesWon();
        }
      });

      currentGame.setSnapshot(
        currentGame.getActivePlayers().map((player) => player.toJSON()),
      );
    } else {
      this.emitNotification(
        currentGame.getId(),
        `${currentPlayer.getUsername()} peeled.`,
        false,
      );

      currentActivePlayers.forEach((player) => {
        player.getHand().addTiles(currentGame.getBunch().removeTiles(1));
      });
    }

    this.emitGameInfo(true);
  }

  dump(tileId: string, boardLocation: BoardLocation | null): void {
    const { currentGame, currentPlayer } = this;

    this.emitNotification(
      currentGame.getId(),
      `${currentPlayer.getUsername()} dumped a tile.`,
      false,
    );

    const dumpedTile = boardLocation
      ? currentPlayer.getBoard().removeTile(boardLocation)
      : currentPlayer.getHand().removeTile(tileId);

    currentPlayer.getHand().addTiles(currentGame.getBunch().removeTiles(3));
    currentGame.getBunch().addTiles([dumpedTile]);

    this.emitGameInfo(true);
  }

  moveTileFromHandToBoard(tileId: string, boardLocation: BoardLocation): void {
    this.currentPlayer.moveTileFromHandToBoard(tileId, boardLocation);
    this.emitGameInfo(true);
  }

  moveTileFromBoardToHand(boardLocation: BoardLocation): void {
    this.currentPlayer.moveTileFromBoardToHand(boardLocation);
    this.emitGameInfo(true);
  }

  moveTileOnBoard(
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ): void {
    this.currentPlayer.moveTileOnBoard(fromLocation, toLocation);
    this.emitGameInfo(true);
  }

  shuffleHand(): void {
    this.currentPlayer.getHand().shuffle();
    this.emitGameInfo(true);
  }

  split(): void {
    const { currentGame } = this;
    const gameId = currentGame.getId();
    const activePlayers = currentGame.getActivePlayers();

    if (
      this.currentGame.isInProgress() ||
      activePlayers.length === 0 ||
      activePlayers.some((player) => player.getStatus() !== PlayerStatus.READY)
    ) {
      throw new Error("Cannot start game, not everyone is ready");
    }

    this.emitNotification(
      gameId,
      "Everyone is ready, the game will start soon!",
      true,
    );

    currentGame.reset();

    activePlayers.forEach((player) => {
      player
        .getHand()
        .addTiles(
          currentGame.getBunch().removeTiles(this.getInitialTileCount()),
        );
    });
    currentGame.setInProgress(true);

    this.emitGameInfo(true);
  }

  private getInitialTileCount(): number {
    return this.currentGame.isShortenedGame()
      ? INITIAL_SHORTENED_GAME_TILE_COUNT
      : INITIAL_TILE_COUNT;
  }
}

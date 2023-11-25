import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { BoardLocation } from "../models/Board";
import Game, { GameJSON } from "../models/Game";
import Player, { PlayerStatus } from "../models/Player";

const MAX_PLAYERS = 16;
const INITIAL_TILE_COUNT = 21;
const INITIAL_SHORTENED_GAME_TILE_COUNT = 2;

export default class GameController {
  private static games: Record<string, Game> = {};

  private io: Server;
  private socket: Socket;
  private currentGame: Game;
  private currentPlayer: Player;

  constructor(
    io: Server,
    socket: Socket,
    currentGame: Game,
    currentPlayer: Player,
  ) {
    this.io = io;
    this.socket = socket;
    this.currentGame = currentGame;
    this.currentPlayer = currentPlayer;
  }

  // From io: send to everyone, including current player
  // From socket: send to everyone except current player
  private static emitNotification(
    from: Server | Socket,
    to: string,
    message: string,
  ): void {
    from.to(to).emit("notification", { message });
  }

  private static emitGameInfo(from: Server | Socket, game: Game): GameJSON {
    const gameInfo = game.toJSON();
    from.to(game.getId()).emit("gameInfo", gameInfo);
    return gameInfo;
  }

  static getGames(): Record<string, Game> {
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
      gameId = uuidv4();
    } while (this.games[gameId]);

    const game = new Game(gameId, gameName, isShortenedGame);
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
    const player = new Player(
      socket.id,
      username,
      isSpectator || game.isInProgress()
        ? PlayerStatus.SPECTATING
        : PlayerStatus.NOT_READY,
      isAdmin,
    );

    game.addPlayer(player);
    socket.join(gameId);
    this.emitNotification(socket, gameId, `${username} has joined the game!`);
    this.emitGameInfo(socket, game);

    return new GameController(io, socket, game, player);
  }

  getCurrentGame(): Game {
    return this.currentGame;
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  kickPlayer(userId: string): void {
    if (!this.currentPlayer.isAdmin()) {
      throw new Error("Only game admins can kick players from the game");
    }

    this.io.sockets.sockets.get(userId)?.disconnect(true);
  }

  leaveGame(): void {
    const { io, socket, currentPlayer, currentGame } = this;

    // TODO: No longer return tiles to bunch when player leaves
    if (currentGame.isInProgress()) {
      currentGame
        .getBunch()
        .addTiles([
          ...currentPlayer.getHand().getTiles(),
          ...currentPlayer.getBoard().getAllTiles(),
        ]);
    }

    const gameId = currentGame.getId();

    currentGame.removePlayer(currentPlayer.getUserId());
    socket.leave(gameId);

    GameController.emitNotification(
      socket,
      gameId,
      `${currentPlayer.getUsername()} has left the game.`,
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
      GameController.emitNotification(
        socket,
        gameId,
        "All active players have left, resetting game",
      );
      GameController.emitGameInfo(io, currentGame);
    } else {
      GameController.emitGameInfo(io, currentGame);
    }
  }

  setStatus(status: PlayerStatus): void {
    const { io, currentGame, currentPlayer, socket } = this;

    if (currentPlayer.getStatus() === status) {
      return;
    }

    if (currentGame.isInProgress() && status === PlayerStatus.READY) {
      throw new Error("Cannot switch to ready while a game is in progress");
    }

    currentPlayer.setStatus(status);

    if (currentGame.isInProgress() && status === PlayerStatus.SPECTATING) {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `${currentPlayer.getUsername()} has switched to a spectator`,
      );
    }

    if (
      currentGame.isInProgress() &&
      currentGame.getActivePlayers().length === 0
    ) {
      GameController.emitNotification(
        io,
        currentGame.getId(),
        "No active players remain, resetting game",
      );

      currentGame.setInProgress(false);
    }

    GameController.emitGameInfo(io, currentGame);
  }

  peel(): void {
    const { io, socket, currentPlayer, currentGame } = this;
    const currentActivePlayers = currentGame.getActivePlayers();
    const currentPlayers = currentGame.getPlayers();

    if (currentPlayer.getHand().getTiles().length > 0) {
      return;
    }

    if (
      currentGame.getBunch().getTiles().length < currentActivePlayers.length
    ) {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `Game is over, ${currentPlayer.getUsername()} won.`,
      );

      GameController.emitNotification(
        io,
        currentPlayer.getUserId(),
        "Game is over, you won!",
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
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `${currentPlayer.getUsername()} peeled.`,
      );

      currentActivePlayers.forEach((player) => {
        player.getHand().addTiles(currentGame.getBunch().removeTiles(1));
      });
    }

    GameController.emitGameInfo(io, currentGame);
  }

  dump(tileId: string, boardLocation: BoardLocation | null): void {
    const { io, socket, currentGame, currentPlayer } = this;

    GameController.emitNotification(
      socket,
      currentGame.getId(),
      `${currentPlayer.getUsername()} dumped a tile.`,
    );

    const dumpedTile = boardLocation
      ? currentPlayer.getBoard().removeTile(boardLocation)
      : currentPlayer.getHand().removeTile(tileId);

    currentPlayer.getHand().addTiles(currentGame.getBunch().removeTiles(3));
    currentGame.getBunch().addTiles([dumpedTile]);

    GameController.emitGameInfo(io, currentGame);
  }

  moveTileFromHandToBoard(tileId: string, boardLocation: BoardLocation): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.moveTileFromHandToBoard(tileId, boardLocation);
    GameController.emitGameInfo(io, currentGame);
  }

  moveTileFromBoardToHand(boardLocation: BoardLocation): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.moveTileFromBoardToHand(boardLocation);
    GameController.emitGameInfo(io, currentGame);
  }

  moveTileOnBoard(
    fromLocation: BoardLocation,
    toLocation: BoardLocation,
  ): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.moveTileOnBoard(fromLocation, toLocation);
    GameController.emitGameInfo(io, currentGame);
  }

  moveAllTilesFromBoardToHand(): void {
    const { io, currentPlayer } = this;
    currentPlayer.getHand().addTiles(currentPlayer.getBoard().clear());
    GameController.emitGameInfo(io, this.currentGame);
  }

  shuffleHand(): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.getHand().shuffle();
    GameController.emitGameInfo(io, currentGame);
  }

  split(): void {
    const { io, currentGame } = this;
    const gameId = currentGame.getId();
    const activePlayers = currentGame.getActivePlayers();

    if (
      this.currentGame.isInProgress() ||
      activePlayers.length === 0 ||
      activePlayers.some((player) => player.getStatus() !== PlayerStatus.READY)
    ) {
      throw new Error("Cannot start game, not everyone is ready");
    }

    GameController.emitNotification(
      io,
      gameId,
      "Everyone is ready, the game will start soon!",
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

    GameController.emitGameInfo(io, currentGame);
  }

  private getInitialTileCount(): number {
    return this.currentGame.isShortenedGame()
      ? INITIAL_SHORTENED_GAME_TILE_COUNT
      : INITIAL_TILE_COUNT;
  }
}

import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import Game, { GameJSON } from '../models/Game';
import Player from '../models/Player';
import { BoardLocation } from '../models/Board';

const MAX_PLAYERS = 8;
const getInitialTileCount = (numPlayers: number): number => {
  if (numPlayers <= 4) {
    return 21;
  }

  if (numPlayers <= 6) {
    return 15;
  }

  return 11;
};

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
    currentPlayer: Player
  ) {
    this.io = io;
    this.socket = socket;
    this.currentGame = currentGame;
    this.currentPlayer = currentPlayer;
  }

  private static emitNotification(
    from: Server | Socket,
    to: string,
    message: string
  ): void {
    from.to(to).emit('notification', { message });
  }

  private static emitGameInfo(from: Server | Socket, game: Game): GameJSON {
    const gameInfo = game.toJSON();
    from.to(game.getId()).emit('gameInfo', gameInfo);
    return gameInfo;
  }

  static createGame(
    gameName: string,
    username: string,
    io: Server,
    socket: Socket
  ): GameController {
    let gameId: string;

    do {
      gameId = uuidv4();
    } while (this.games[gameId]);

    const game = new Game(gameId, gameName);
    this.games = {
      ...this.games,
      [gameId]: game,
    };

    return this.joinGame(gameId, username, io, socket);
  }

  static joinGame(
    gameId: string,
    username: string,
    io: Server,
    socket: Socket
  ): GameController {
    const game = this.games[gameId];

    if (!game) {
      throw new Error('Game does not exist');
    }

    if (game.getPlayers().length >= MAX_PLAYERS) {
      throw new Error('Game is full');
    }

    if (game.isInProgress()) {
      throw new Error('Game is already in progress');
    }

    const player = new Player(socket.id, username);

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

  leaveGame(): void {
    const { io, socket, currentPlayer, currentGame } = this;

    if (currentGame.isInProgress()) {
      currentGame.getBunch().addTiles(currentPlayer.getHand().getTiles());
      // TODO: Add board back to bunch too
    }

    const gameId = currentGame.getId();

    currentGame.removePlayer(currentPlayer.getUserId());
    socket.leave(gameId);

    GameController.emitNotification(
      socket,
      gameId,
      `${currentPlayer.getUsername()} has left the game.`
    );

    const everyoneElseIsReady = currentGame
      .getPlayers()
      .every((player) => player.isReady());

    if (currentGame.getPlayers().length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [gameId]: toOmit, ...rest } = GameController.games;
      GameController.games = rest;
    } else if (everyoneElseIsReady) {
      this.startGame();
    } else {
      GameController.emitGameInfo(io, currentGame);
    }
  }

  split(): void {
    const { io, socket, currentGame, currentPlayer } = this;
    const gameId = currentGame.getId();

    currentPlayer.setReady(true);

    GameController.emitNotification(
      socket,
      gameId,
      `${currentPlayer.getUsername()} is ready!`
    );

    const everyoneIsReady = currentGame
      .getPlayers()
      .every((player) => player.isReady());

    if (everyoneIsReady) {
      this.startGame();
    } else {
      GameController.emitGameInfo(io, currentGame);
    }
  }

  peel(): void {
    const { io, socket, currentPlayer, currentGame } = this;
    const currentPlayers = currentGame.getPlayers();

    if (currentGame.getBunch().getTiles().length < currentPlayers.length) {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `Game is over, ${currentPlayer.getUsername()} won.`
      );

      GameController.emitNotification(
        io,
        currentPlayer.getUserId(),
        'Game is over, you won!'
      );

      currentGame.setInProgress(false);

      currentPlayers.forEach((player) => {
        player.setReady(false);
        player.setTopBanana(player.getUserId() === currentPlayer.getUserId());
      });

      currentGame.setSnapshot(
        currentGame.getPlayers().map((player) => player.toJSON())
      );
    } else {
      GameController.emitNotification(
        socket,
        currentGame.getId(),
        `${currentPlayer.getUsername()} peeled.`
      );

      currentPlayers.forEach((player) => {
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
      `${currentPlayer.getUsername()} dumped a tile.`
    );

    const dumpedTile = !!boardLocation
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
    toLocation: BoardLocation
  ): void {
    const { io, currentGame, currentPlayer } = this;
    currentPlayer.moveTileOnBoard(fromLocation, toLocation);
    GameController.emitGameInfo(io, currentGame);
  }

  private startGame(): void {
    const { io, currentGame } = this;
    const gameId = currentGame.getId();

    GameController.emitNotification(
      io,
      gameId,
      'Everyone is ready, the game will start soon!'
    );

    const currentPlayers = currentGame.getPlayers();
    currentGame.reset();

    currentPlayers.forEach((player) => {
      player
        .getHand()
        .addTiles(
          currentGame
            .getBunch()
            .removeTiles(getInitialTileCount(currentPlayers.length))
        );
    });
    currentGame.setInProgress(true);

    GameController.emitGameInfo(io, currentGame);
  }
}

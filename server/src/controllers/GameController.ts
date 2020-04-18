import { Server, Socket } from 'socket.io';

import Game from '../models/Game';
import Player, { Board, BoardPosition } from '../models/Player';
import Tile from '../models/Tile';

type GameInfo = {
  gameId: string;
  gameName: string;
  winningBoard?: Board;
  isInProgress: boolean;
  bunchSize: number;
  players: {
    userId: string;
    username: string;
    isOwner: boolean;
    isReady: boolean;
    hand: Record<string, Tile>;
    board: Board;
  }[];
};

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
  private io: Server;
  private socket: Socket;
  private userId: string;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.userId = socket.id;
  }

  private emitNotification(
    from: Server | Socket,
    to: string,
    message: string
  ): void {
    from.to(to).emit('notification', { message });
  }

  private emitGameInfo(from: Server | Socket, game: Game): GameInfo {
    const gameInfo = {
      gameId: game.getId(),
      gameName: game.getName(),
      isInProgress: game.isInProgress(),
      bunchSize: game.getBunch().length,
      winningBoard: game.getWinningBoard(),
      players: game.getPlayers().map((player) => ({
        userId: player.getUserId(),
        username: player.getUsername(),
        isOwner: player.isOwner(),
        isReady: player.isReady(),
        isTopBanana: player.isTopBanana(),
        hand: player.getHand(),
        board: player.getBoard(),
      })),
    };

    from.to(game.getId()).emit('gameInfo', gameInfo);

    return gameInfo;
  }

  createGame(gameName: string, username: string): GameInfo {
    const game = new Game(gameName);
    return this.joinGame(game.getId(), username, true);
  }

  joinGame(gameId: string, username: string, owner: boolean): GameInfo {
    const { socket, userId } = this;
    const game = Game.get(gameId);

    if (!game) {
      throw new Error('Game does not exist');
    }

    if (game.getPlayers().length >= MAX_PLAYERS) {
      throw new Error('Game is full');
    }

    if (game.isInProgress()) {
      throw new Error('Game is already in progress');
    }

    new Player(userId, gameId, username, owner);

    socket.join(gameId);
    this.emitNotification(socket, gameId, `${username} has joined the game!`);
    return this.emitGameInfo(socket, game);
  }

  leaveGame(): void {
    const { socket, userId } = this;
    const player = Player.get(userId);

    if (player) {
      const gameId = player.getGameId();
      const game = Game.get(gameId) as Game;

      if (game.isInProgress()) {
        game.addTilesToBunch(Object.values(player.getHand()));
      }

      player.delete();
      socket.to(gameId).emit('playerLeft', {
        userId: player.getUserId(),
        username: player.getUsername(),
      });
      socket.leave(gameId);
      this.emitNotification(
        socket,
        gameId,
        `${player.getUsername()} has left the game.`
      );
      this.emitGameInfo(socket, game);
    }
  }

  split(): void {
    const { io, socket, userId } = this;

    const currentPlayer = Player.get(userId) as Player;

    const gameId = currentPlayer.getGameId();
    const game = Game.get(gameId) as Game;

    currentPlayer.setReady(true);

    const playersInGame = game.getPlayers();
    const everyoneIsReady = playersInGame.every((player) => player.isReady());
    this.emitNotification(
      socket,
      gameId,
      `${currentPlayer.getUsername()} is ready!`
    );

    if (everyoneIsReady) {
      this.emitNotification(
        io,
        gameId,
        'Everyone is ready, the game will start soon!'
      );
      game.initializeBunch();
      playersInGame.forEach((player) => {
        player.resetHand();
        player.resetBoard();
        player.addTilesToHand(
          game.removeTilesFromBunch(getInitialTileCount(playersInGame.length))
        );
      });
      game.setInProgress(true);
    }

    this.emitGameInfo(io, game);
  }

  peel(): void {
    const { io, socket, userId } = this;

    const currentPlayer = Player.get(userId) as Player;
    const game = Game.get(currentPlayer.getGameId()) as Game;
    const players = game.getPlayers();

    if (game.getBunch().length < players.length) {
      this.emitNotification(
        socket,
        game.getId(),
        `Game is over, ${currentPlayer.getUsername()} won.`
      );
      this.emitNotification(io, userId, 'Game is over, you won!');
      game.setInProgress(false);
      game.setWinningBoard(currentPlayer.getBoard());
      players.forEach((player) => {
        player.setReady(false);
        player.setTopBanana(player.getUserId() === userId);
      });
    } else {
      this.emitNotification(
        socket,
        game.getId(),
        `${currentPlayer.getUsername()} peeled.`
      );
      players.forEach((player) => {
        player.addTilesToHand(game.removeTilesFromBunch(1));
      });
    }

    this.emitGameInfo(io, game);
  }

  dump(tileId: string, boardPosition: BoardPosition | null): void {
    const { io, socket, userId } = this;

    const currentPlayer = Player.get(userId) as Player;
    const game = Game.get(currentPlayer.getGameId()) as Game;

    this.emitNotification(
      socket,
      game.getId(),
      `${currentPlayer.getUsername()} dumped a tile.`
    );
    const dumpedTile = !!boardPosition
      ? currentPlayer.removeTileFromBoard(boardPosition)
      : currentPlayer.removeTilesFromHand([tileId])[0];
    currentPlayer.addTilesToHand(game.removeTilesFromBunch(3));
    game.addTilesToBunch([dumpedTile]);

    this.emitGameInfo(io, game);
  }

  moveTileFromHandToBoard(tileId: string, boardPosition: BoardPosition): void {
    const { io, userId } = this;

    const player = Player.get(userId) as Player;
    player.moveTileFromHandToBoard(tileId, boardPosition);
    const game = Game.get(player.getGameId()) as Game;

    this.emitGameInfo(io, game);
  }

  moveTileFromBoardToHand(boardPosition: BoardPosition): void {
    const { io, userId } = this;

    const player = Player.get(userId) as Player;
    player.moveTileFromBoardToHand(boardPosition);
    const game = Game.get(player.getGameId()) as Game;

    this.emitGameInfo(io, game);
  }

  moveTileOnBoard(
    fromPosition: BoardPosition,
    toPosition: BoardPosition
  ): void {
    const { io, userId } = this;

    const player = Player.get(userId) as Player;
    player.moveTileOnBoard(fromPosition, toPosition);
    const game = Game.get(player.getGameId()) as Game;

    this.emitGameInfo(io, game);
  }
}

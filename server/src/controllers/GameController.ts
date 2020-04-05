import { Server, Socket } from 'socket.io';

import Game from '../models/Game';
import Player, { Board } from '../models/Player';
import Tile from '../models/Tile';

type GameInfo = {
  gameId: string;
  gameName: string;
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

  private emitGameInfo(game: Game, from: Server | Socket): GameInfo {
    const gameInfo = {
      gameId: game.getId(),
      gameName: game.getName(),
      isInProgress: game.isInProgress(),
      bunchSize: game.getBunch().length,
      players: game.getPlayers().map((player) => ({
        userId: player.getUserId(),
        username: player.getUsername(),
        isOwner: player.isOwner(),
        isReady: player.isReady(),
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

    const player = new Player(userId, gameId, username, owner);

    socket.join(gameId);
    socket.to(gameId).emit('playerJoined', {
      userId: player.getUserId(),
      username: player.getUsername(),
    });

    return this.emitGameInfo(game, socket);
  }

  leaveGame(): void {
    const { io, socket, userId } = this;
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
      this.emitGameInfo(game, io);
    }
  }

  split(): void {
    const { io, socket, userId } = this;

    const currentPlayer = Player.get(userId) as Player;

    const gameId = currentPlayer.getGameId();
    const game = Game.get(gameId) as Game;

    currentPlayer.setReady(true);

    socket
      .to(gameId)
      .emit('playerReady', { userId, username: currentPlayer.getUsername() });

    const playersInGame = game.getPlayers();
    const everyoneIsReady = playersInGame.every((player) => player.isReady());

    if (everyoneIsReady) {
      game.initializeBunch();
      playersInGame.forEach((player) =>
        player.addTilesToHand(
          game.removeTilesFromBunch(getInitialTileCount(playersInGame.length))
        )
      );
      game.setInProgress(true);
    }

    this.emitGameInfo(game, io);
  }
}

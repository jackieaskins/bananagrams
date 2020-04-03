import { Server, Socket } from 'socket.io';

import Game from '../models/Game';
import Player from '../models/Player';
import Tile from '../models/Tile';

interface GamePlayer {
  userId: string;
  username: string;
  isOwner: boolean;
  isReady: boolean;
}

type GameState = {
  gameId?: string;
  gameName?: string;
  isInProgress?: boolean;
  bunchSize?: number;
  hand?: Tile[];
  players?: GamePlayer[];
};

const getInitialTileCount = (numPlayers: number): number => {
  if (numPlayers < 5) {
    return 21;
  }

  if (numPlayers < 7) {
    return 15;
  }

  return 11;
};

const playerToGamePlayer = (player: Player): GamePlayer => ({
  userId: player.getUserId(),
  username: player.getUsername(),
  isOwner: player.isOwner(),
  isReady: player.isReady(),
});

export default class GameController {
  private io: Server;
  private socket: Socket;

  constructor({ io, socket }: { io: Server; socket: Socket }) {
    this.io = io;
    this.socket = socket;
  }

  createGame({
    gameName,
    username,
  }: {
    gameName: string;
    username: string;
  }): GameState {
    const game = new Game({ name: gameName });
    return this.joinGame({
      gameId: game.getId(),
      username,
      owner: true,
    });
  }

  joinGame({
    gameId,
    username,
    owner,
  }: {
    gameId: string;
    username: string;
    owner: boolean;
  }): GameState {
    const { socket } = this;
    const { id: userId } = socket;

    const player = new Player({ gameId, userId, username, owner });
    const game = Game.getGame({ id: gameId }) as Game;
    const players: Player[] = Player.getPlayersInGame({ gameId });

    socket.join(gameId);
    socket.to(gameId).emit('playerJoined', playerToGamePlayer(player));

    return {
      gameId,
      gameName: game.getName(),
      isInProgress: game.isInProgress(),
      players: players.map(playerToGamePlayer),
    };
  }

  leaveGame(): void {
    const { socket } = this;
    const { id: userId } = socket;

    const player = Player.getPlayer({ userId });

    if (player) {
      const gameId = player.getGameId();

      player.delete();
      socket.to(gameId).emit('playerLeft', { userId: player.getUserId() });
      socket.leave(gameId);
    }
  }

  split(): void {
    const { io, socket } = this;
    const { id: userId } = socket;

    const currentPlayer = Player.getPlayer({ userId });

    if (currentPlayer) {
      const gameId = currentPlayer.getGameId();
      currentPlayer.setReady({ ready: true });

      socket.to(gameId).emit('playerReady', { userId });

      const playersInGame = Player.getPlayersInGame({ gameId });
      const everyoneIsReady = playersInGame.every((player) => player.isReady());

      if (everyoneIsReady) {
        const game = Game.getGame({ id: gameId }) as Game;

        game.initializeBunch();
        playersInGame.forEach((player) =>
          player.addTiles({
            tiles: game.removeTiles({
              count: getInitialTileCount(playersInGame.length),
            }),
          })
        );
        game.setInProgress({ inProgress: true });

        playersInGame.forEach((player) =>
          io.to(player.getUserId()).emit('gameReady', {
            isInProgress: game.isInProgress(),
            bunchSize: game.getBunch().length,
            hand: player.getHand(),
          })
        );
      }
    }
  }
}

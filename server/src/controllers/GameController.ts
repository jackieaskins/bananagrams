import { Socket } from 'socket.io';

import Game from '../models/Game';
import Player from '../models/Player';

interface GamePlayer {
  userId: string;
  username: string;
  isOwner: boolean;
  isPlaying: boolean;
}

type GameState = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  players: GamePlayer[];
};

const playerToGamePlayer = (player: Player): GamePlayer => ({
  userId: player.getUserId(),
  username: player.getUsername(),
  isOwner: player.isOwner(),
  isPlaying: player.isPlaying(),
});

export default class GameController {
  private socket: Socket;

  constructor({ socket }: { socket: Socket }) {
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
}

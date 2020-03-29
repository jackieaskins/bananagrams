import Game, { GameId } from './Game';

export type Players = Record<UserId, Player>;
export type UserId = string;
export type Username = string;

export default class Player {
  private static players: Players = {};

  private userId: UserId;
  private gameId: GameId;
  private username: Username;
  private owner: boolean;

  constructor({
    userId,
    gameId,
    username,
    owner = false,
  }: {
    userId: UserId;
    gameId: GameId;
    username: Username;
    owner?: boolean;
  }) {
    if (Player.players[userId]) {
      throw new Error('Player already exists');
    }

    if (!Game.getGame({ id: gameId })) {
      throw new Error('Game does not exist');
    }

    this.userId = userId;
    this.gameId = gameId;
    this.username = username;
    this.owner = owner;

    Player.players[userId] = this;
  }

  static getPlayer({ userId }: { userId: UserId }): Player | undefined {
    return this.players[userId];
  }

  static getPlayers(): Players {
    return { ...this.players };
  }

  static getPlayersInGame({ gameId }: { gameId: GameId }): Players {
    return Object.fromEntries(
      Object.entries(this.players).filter(
        ([, player]) => player.gameId === gameId
      )
    );
  }

  getUserId(): UserId {
    return this.userId;
  }

  getGameId(): GameId {
    return this.gameId;
  }

  getUsername(): Username {
    return this.username;
  }

  setUsername({ username }: { username: Username }): void {
    this.username = username;
  }

  isOwner(): boolean {
    return this.owner;
  }

  delete(): Player {
    const { gameId, userId } = this;

    if (this.owner) {
      const newOwner = Object.values(Player.players).find(
        (player) => player.gameId === gameId && player.userId !== userId
      );

      if (newOwner) {
        newOwner.owner = true;
        delete Player.players[userId];
      } else {
        delete Player.players[userId];
        Game.getGame({ id: gameId })?.delete();
      }
    }

    delete Player.players[userId];
    return this;
  }
}

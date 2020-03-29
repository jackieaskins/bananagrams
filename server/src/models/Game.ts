import { v4 as uuidv4 } from 'uuid';

import Player from './Player';

export type Games = Record<GameId, Game>;
export type GameId = string;
export type GameName = string;

export default class Game {
  private static games: Games = {};

  private id: GameId;
  private name: GameName;

  constructor({ name }: { name: GameName }) {
    let id: GameId;

    do {
      id = uuidv4();
    } while (Game.games[id]);

    this.id = id;
    this.name = name;

    Game.games[id] = this;
  }

  static getGame({ id }: { id: GameId }): Game | undefined {
    return this.games[id];
  }

  static getGames(): Games {
    return { ...this.games };
  }

  getId(): GameId {
    return this.id;
  }

  getName(): GameName {
    return this.name;
  }

  delete(): Game {
    const { id } = this;

    if (Object.keys(Player.getPlayersInGame({ gameId: id })).length > 0) {
      throw new Error('There are still players in this game');
    }

    delete Game.games[id];

    return this;
  }
}

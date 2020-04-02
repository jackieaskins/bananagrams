import { v4 as uuidv4 } from 'uuid';

import tileBreakdown from '../tileBreakdown';
import Player from './Player';
import Tile from './Tile';

export type Games = Record<string, Game>;

export default class Game {
  private static games: Games = {};

  private id: string;
  private name: string;
  private inProgress: boolean;
  private bunch: Tile[];

  constructor({ name }: { name: string }) {
    let id: string;

    do {
      id = uuidv4();
    } while (Game.games[id]);

    this.id = id;
    this.name = name;
    this.inProgress = false;
    this.bunch = [];

    Game.games[id] = this;
  }

  static getGame({ id }: { id: string }): Game | undefined {
    return this.games[id];
  }

  static getGames(): Games {
    return { ...this.games };
  }

  static resetGames(): void {
    this.games = {};
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getBunch(): Tile[] {
    return [...this.bunch];
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  setInProgress({ inProgress }: { inProgress: boolean }): void {
    this.inProgress = inProgress;
  }

  initializeBunch(): void {
    this.bunch = tileBreakdown
      .map(({ letter, count }) =>
        Array(count)
          .fill(null)
          .map((_, i) => new Tile({ id: `${letter}${i}`, letter }))
      )
      .flat();
  }

  removeTiles({ count }: { count: number }): Tile[] {
    if (this.bunch.length < count) {
      throw new Error(
        `The bunch has less than ${count} ${count === 1 ? 'tile' : 'tiles'}`
      );
    }

    return Array.from(Array(count))
      .map(() =>
        this.bunch.splice(Math.floor(Math.random() * this.bunch.length), 1)
      )
      .flat();
  }

  addTiles({ tiles }: { tiles: Tile[] }): void {
    this.bunch = this.bunch.concat(tiles);
  }

  delete(): Game {
    const { id } = this;

    if (Player.getPlayersInGame({ gameId: id }).length > 0) {
      throw new Error('There are still players in this game');
    }

    delete Game.games[id];

    return this;
  }
}

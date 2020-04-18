import { v4 as uuidv4 } from 'uuid';

import tileBreakdown from '../tileBreakdown';
import Player, { Board } from './Player';
import Tile from './Tile';

export type Games = Record<string, Game>;

export default class Game {
  private static games: Games = {};

  private id: string;
  private name: string;
  private winningBoard?: Board;
  private inProgress: boolean;
  private bunch: Tile[];

  constructor(name: string) {
    let id: string;

    do {
      id = uuidv4();
    } while (Game.games[id]);

    this.id = id;
    this.name = name;
    this.inProgress = false;
    this.bunch = [];

    Game.games = { ...Game.games, [id]: this };
  }

  static get(id: string): Game | undefined {
    return this.games[id];
  }

  static all(): Games {
    return { ...this.games };
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPlayers(): Player[] {
    return Object.values(Player.all()).filter(
      (player) => player.getGameId() === this.id
    );
  }

  getBunch(): Tile[] {
    return [...this.bunch];
  }

  getWinningBoard(): Board | undefined {
    return this.winningBoard;
  }

  setWinningBoard(winningBoard: Board): void {
    this.winningBoard = winningBoard;
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  setInProgress(inProgress: boolean): void {
    this.inProgress = inProgress;
  }

  initializeBunch(): void {
    this.bunch = tileBreakdown
      .map(({ letter, count }) =>
        Array(count)
          .fill(null)
          .map((_, i) => new Tile(`${letter}${i}`, letter))
      )
      .flat();
  }

  removeTilesFromBunch(count: number): Tile[] {
    if (this.bunch.length < count) {
      throw new Error(
        `The bunch has less than ${count} ${count === 1 ? 'tile' : 'tiles'}`
      );
    }

    return Array.from(Array(count)).map(() => {
      const index = Math.floor(Math.random() * this.bunch.length);

      const tile = this.bunch[index];
      this.bunch = [
        ...this.bunch.slice(0, index),
        ...this.bunch.slice(index + 1),
      ];

      return tile;
    });
  }

  addTilesToBunch(tiles: Tile[]): void {
    this.bunch = [...this.bunch, ...tiles];
  }

  delete(): Game {
    if (this.getPlayers().length > 0) {
      throw new Error('There are still players in this game');
    }

    const { [this.id]: toOmit, ...rest } = Game.games;
    Game.games = rest;

    return toOmit;
  }
}

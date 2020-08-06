import Tile, { TileJSON } from './Tile';
import { getTiles } from '../tileBreakdown';
import BaseModel from './BaseModel';
import Game from './Game';

export type BunchJSON = TileJSON[];

const MULTIPLIER_DIVISOR = 4;

export default class Bunch implements BaseModel<BunchJSON> {
  private game: Game;
  private tiles: Tile[] = [];

  constructor(game: Game) {
    this.game = game;
  }

  getTiles(): Tile[] {
    return [...this.tiles];
  }

  toJSON(): BunchJSON {
    return this.tiles.map((tile) => tile.toJSON());
  }

  reset(): void {
    const multiplier = Math.ceil(
      this.game.getPlayers().length / MULTIPLIER_DIVISOR
    );
    this.tiles = getTiles(multiplier);
  }

  addTiles(tiles: Tile[]): void {
    this.tiles = [...this.tiles, ...tiles];
  }

  removeTiles(count: number): Tile[] {
    if (this.tiles.length < count) {
      throw new Error(
        `The bunch has less than ${count} ${count === 1 ? 'tile' : 'tiles'}`
      );
    }

    return Array.from(Array(count)).map(() => {
      const index = Math.floor(Math.random() * this.tiles.length);

      const tile = this.tiles[index];
      this.tiles = [
        ...this.tiles.slice(0, index),
        ...this.tiles.slice(index + 1),
      ];

      return tile;
    });
  }
}

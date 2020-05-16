import Tile, { TileJSON } from './Tile';
import tileBreakdown from '../tileBreakdown';
import BaseModel from './BaseModel';

export type BunchJSON = TileJSON[];

const initializeBunch = (): Tile[] =>
  tileBreakdown
    .map(({ letter, count }) =>
      Array(count)
        .fill(null)
        .map((_, i) => new Tile(`${letter}${i}`, letter))
    )
    .flat();

export default class Bunch implements BaseModel<BunchJSON> {
  private tiles: Tile[] = [];

  getTiles(): Tile[] {
    return [...this.tiles];
  }

  toJSON(): BunchJSON {
    return this.tiles.map((tile) => tile.toJSON());
  }

  reset(): void {
    this.tiles = initializeBunch();
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

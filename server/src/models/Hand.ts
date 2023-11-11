import Tile, { TileJSON } from "./Tile";
import BaseModel from "./BaseModel";

export type HandJSON = TileJSON[];

export default class Hand implements BaseModel<HandJSON> {
  private tiles: Tile[] = [];

  getTiles(): Tile[] {
    return [...this.tiles];
  }

  setTiles(tiles: Tile[]): void {
    this.tiles = [...tiles];
  }

  toJSON(): HandJSON {
    return this.tiles.map((tile) => tile.toJSON());
  }

  reset(): void {
    this.tiles = [];
  }

  addTiles(tiles: Tile[]): void {
    this.tiles = [...this.tiles, ...tiles];
  }

  removeTile(id: string): Tile {
    let removedTile: Tile | null = null;

    this.tiles = this.tiles.filter((tile) => {
      if (id === tile.getId()) {
        removedTile = tile;
        return false;
      }

      return true;
    });

    if (removedTile === null) {
      throw new Error(`Tile with id ${id} is not present in hand`);
    }

    return removedTile;
  }

  shuffle(): void {
    const shuffledTiles = [...this.tiles];
    let currentIndex = shuffledTiles.length;

    while (currentIndex !== 0) {
      const swapIndex = Math.floor(Math.random() * currentIndex--);

      const temp = shuffledTiles[currentIndex];
      shuffledTiles[currentIndex] = shuffledTiles[swapIndex];
      shuffledTiles[swapIndex] = temp;
    }

    this.tiles = shuffledTiles;
  }
}

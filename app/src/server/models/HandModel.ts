import BaseModel from "./BaseModel";
import TileModel from "./TileModel";
import { Hand } from "@/types/hand";

export default class HandModel implements BaseModel<Hand> {
  private tiles: TileModel[] = [];

  getTiles(): TileModel[] {
    return [...this.tiles];
  }

  setTiles(tiles: TileModel[]): void {
    this.tiles = [...tiles];
  }

  toJSON(): Hand {
    return this.tiles.map((tile) => tile.toJSON());
  }

  reset(): void {
    this.tiles = [];
  }

  addTiles(tiles: TileModel[]): void {
    this.tiles = [...this.tiles, ...tiles];
  }

  removeTile(id: string): TileModel {
    let removedTile: TileModel | null = null;

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

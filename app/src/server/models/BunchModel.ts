import BaseModel from "./BaseModel";
import GameModel from "./GameModel";
import TileModel from "./TileModel";
import tileBreakdown from "@/server/tileBreakdown";
import { Bunch } from "@/types/bunch";

const MULTIPLIER_DIVISOR = 4;

export default class BunchModel implements BaseModel<Bunch> {
  private game: GameModel;
  private tiles: TileModel[] = [];

  constructor(game: GameModel) {
    this.game = game;
  }

  getTiles(): TileModel[] {
    return [...this.tiles];
  }

  toJSON(): Bunch {
    return this.tiles.map((tile) => tile.toJSON());
  }

  reset(): void {
    if (this.game.isShortenedGame()) {
      this.tiles = [
        new TileModel("A1", "A"),
        new TileModel("E1", "E"),
        new TileModel("T1", "T"),
      ];

      return;
    }

    const multiplier = Math.ceil(
      this.game.getActivePlayers().length / MULTIPLIER_DIVISOR,
    );

    this.tiles = tileBreakdown
      .map(({ letter, count }) =>
        Array(count * multiplier)
          .fill(null)
          .map((_, i) => new TileModel(`${letter}${i}`, letter)),
      )
      .flat();
  }

  addTiles(tiles: TileModel[]): void {
    this.tiles = [...this.tiles, ...tiles];
  }

  removeTiles(count: number): TileModel[] {
    if (this.tiles.length < count) {
      throw new Error(
        `The bunch has less than ${count} ${count === 1 ? "tile" : "tiles"}`,
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

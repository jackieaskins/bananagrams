import { Letter, Tile } from "../../types/tile";
import BaseModel from "./BaseModel";

export default class TileModel implements BaseModel<Tile> {
  private id: string;
  private letter: Letter;

  constructor(id: string, letter: Letter) {
    this.id = id;
    this.letter = letter;
  }

  getId(): string {
    return this.id;
  }

  getLetter(): string {
    return this.letter;
  }

  toJSON(): Tile {
    const { id, letter } = this;
    return { id, letter };
  }

  reset(): void {}
}

import BaseModel from './BaseModel';

export type TileJSON = {
  id: string;
  letter: string;
};

export default class Tile implements BaseModel<TileJSON> {
  private id: string;
  private letter: string;

  constructor(id: string, letter: string) {
    this.id = id;
    this.letter = letter;
  }

  getId(): string {
    return this.id;
  }

  getLetter(): string {
    return this.letter;
  }

  toJSON(): TileJSON {
    const { id, letter } = this;
    return { id, letter };
  }

  reset(): void {
    return;
  }
}

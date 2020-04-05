export default class Tile {
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
}

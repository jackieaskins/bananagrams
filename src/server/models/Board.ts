import { generateBoardKey } from "../boardKey";
import { validateAddTile, validateRemoveTile } from "../boardValidation";
import BaseModel from "./BaseModel";
import Tile, { TileJSON } from "./Tile";

export type BoardLocation = {
  x: number;
  y: number;
};
export enum Direction {
  ACROSS = "ACROSS",
  DOWN = "DOWN",
}
export enum ValidationStatus {
  NOT_VALIDATED = "NOT_VALIDATED",
  VALID = "VALID",
  INVALID = "INVALID",
}
export type WordInfo = {
  start: BoardLocation;
  validation: ValidationStatus;
};
export type BoardSquare = {
  tile: Tile;
  wordInfo: Record<Direction, WordInfo>;
};
export type BoardSquares = Record<string, BoardSquare>;
export type BoardJSON = Record<
  string,
  {
    tile: TileJSON;
    wordInfo: {
      [Direction.ACROSS]?: WordInfo;
      [Direction.DOWN]?: WordInfo;
    };
  }
>;

function initializeBoard(): BoardSquares {
  return {};
}

export default class Board implements BaseModel<BoardJSON> {
  private squares = initializeBoard();

  getSquares(): BoardSquares {
    return Object.fromEntries(
      Object.entries(this.squares).map(([key, square]) => [key, { ...square }]),
    );
  }

  getAllTiles(): Tile[] {
    return Object.values(this.squares).map(({ tile }) => tile);
  }

  reset(): void {
    this.squares = initializeBoard();
  }

  clear(): Tile[] {
    const clearedTiles = Object.values(this.getSquares()).map(
      ({ tile }) => tile,
    );

    this.squares = {};

    return clearedTiles;
  }

  private getSquare(location: BoardLocation) {
    return this.squares[generateBoardKey(location)];
  }

  validateEmptySquare({ x, y }: BoardLocation): void {
    if (this.getSquare({ x, y })) {
      throw new Error(`Board already has tile at location ${x}, ${y}`);
    }
  }

  isEmptySquare(location: BoardLocation): boolean {
    return !this.getSquare(location);
  }

  toJSON(): BoardJSON {
    return Object.fromEntries(
      Object.entries(this.squares).map(([key, square]) => [
        key,
        { tile: square.tile.toJSON(), wordInfo: square.wordInfo },
      ]),
    );
  }

  removeTile({ x, y }: BoardLocation): Tile {
    const square = this.getSquare({ x, y });

    if (!square) {
      throw new Error(`Board does not have a tile at location ${x}, ${y}`);
    }

    const { tile } = square;
    this.squares = validateRemoveTile(this.getSquares(), { x, y });
    return tile;
  }

  addTile(location: BoardLocation, tile: Tile): void {
    this.validateEmptySquare(location);

    this.squares = validateAddTile(this.getSquares(), location, tile);
  }
}

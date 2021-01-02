import { validateAddTile, validateRemoveTile } from '../boardValidation';
import BaseModel from './BaseModel';
import Tile, { TileJSON } from './Tile';

export type BoardPosition = {
  row: number;
  col: number;
};
export enum Direction {
  ACROSS = 'ACROSS',
  DOWN = 'DOWN',
}
export enum ValidationStatus {
  NOT_VALIDATED = 'NOT_VALIDATED',
  VALID = 'VALID',
  INVALID = 'INVALID',
}
export type WordInfo = {
  start: BoardPosition;
  validation: ValidationStatus;
};
export type BoardSquare = {
  tile: Tile;
  wordInfo: Record<Direction, WordInfo>;
};
export type BoardRow = (BoardSquare | null)[];
export type BoardSquares = Record<string, BoardSquare | null>;
export type BoardJSON = Record<
  string,
  {
    tile: TileJSON;
    wordInfo: {
      [Direction.ACROSS]?: WordInfo;
      [Direction.DOWN]?: WordInfo;
    };
  } | null
>;

export const getSquareId = ({ row, col }: BoardPosition): string =>
  `${row},${col}`;

export default class Board implements BaseModel<BoardJSON> {
  private squares: BoardSquares = {};

  getSquares(): BoardSquares {
    return { ...this.squares };
  }

  getAllTiles(): Tile[] {
    return Object.values(this.squares)
      .filter((square) => square)
      .map((square) => (square as BoardSquare).tile);
  }

  reset(): void {
    this.squares = {};
  }

  clear(): Tile[] {
    const clearedTiles = this.getAllTiles();
    this.squares = {};
    return clearedTiles;
  }

  validateEmptySquare({ row, col }: BoardPosition): void {
    if (this.squares[getSquareId({ row, col })]) {
      throw new Error(`Board already has tile at position ${row}, ${col}`);
    }
  }

  toJSON(): BoardJSON {
    return Object.fromEntries(
      Object.entries(this.squares).map(([id, square]) => {
        if (square) {
          return [
            id,
            { tile: square.tile.toJSON(), wordInfo: square.wordInfo },
          ];
        }

        return [id, null];
      })
    );
  }

  removeTile({ row, col }: BoardPosition): Tile {
    const square = this.squares[getSquareId({ row, col })];
    if (!square) {
      throw new Error(`Board does not have a tile at position ${row}, ${col}`);
    }

    const { tile } = square;
    this.squares = validateRemoveTile(this.squares, { row, col });
    return tile;
  }

  addTile(position: BoardPosition, tile: Tile): void {
    this.validateEmptySquare(position);

    this.squares = validateAddTile(this.squares, position, tile);
  }
}

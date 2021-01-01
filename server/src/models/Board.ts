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
export type BoardSquares = (BoardSquare | null)[][];
export type BoardJSON = ({
  tile: TileJSON;
  wordInfo: {
    [Direction.ACROSS]?: WordInfo;
    [Direction.DOWN]?: WordInfo;
  };
} | null)[][];

export const BOARD_SIZE = 21;
const initializeBoard = (): BoardSquares =>
  [...Array(BOARD_SIZE)].map(() => Array(BOARD_SIZE).fill(null));

export default class Board implements BaseModel<BoardJSON> {
  private squares = initializeBoard();

  getSquares(): BoardSquares {
    return this.squares.map((row) =>
      row.map((square) => (!!square ? { ...square } : null))
    );
  }

  getAllTiles(): Tile[] {
    return this.squares.flatMap((row: BoardRow): Tile[] =>
      row.reduce(
        (tiles: Tile[], square: BoardSquare | null): Tile[] =>
          !!square ? [...tiles, square.tile] : tiles,
        []
      )
    );
  }

  reset(): void {
    this.squares = initializeBoard();
  }

  clear(): Tile[] {
    const clearedTiles: Tile[] = [];

    this.squares = this.squares.map((row) =>
      row.map((square) => {
        if (square !== null) {
          clearedTiles.push(square.tile);
        }

        return null;
      })
    );

    return clearedTiles;
  }

  validateEmptySquare({ row, col }: BoardPosition): void {
    if (this.squares[row][col]) {
      throw new Error(`Board already has tile at position ${row}, ${col}`);
    }
  }

  toJSON(): BoardJSON {
    return this.squares.map((row) =>
      row.map((square) => {
        if (square === null) {
          return null;
        }

        return { tile: square.tile.toJSON(), wordInfo: square.wordInfo };
      })
    );
  }

  removeTile({ row, col }: BoardPosition): Tile {
    const square = this.squares[row][col];
    if (!square) {
      throw new Error(`Board does not have a tile at position ${row}, ${col}`);
    }

    const { tile } = square;
    this.squares = validateRemoveTile(this.getSquares(), { row, col });
    return tile;
  }

  addTile(position: BoardPosition, tile: Tile): void {
    this.validateEmptySquare(position);

    this.squares = validateAddTile(this.getSquares(), position, tile);
  }
}

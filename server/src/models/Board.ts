import Tile, { TileJSON } from './Tile';
import BaseModel from './BaseModel';
import { validateAddTile, validateRemoveTile } from '../boardValidation';

export type BoardLocation = {
  x: number;
  y: number;
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
  start: BoardLocation;
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

  validateEmptySquare({ x, y }: BoardLocation): void {
    if (this.squares[x][y]) {
      throw new Error(`Board already has tile at location ${x}, ${y}`);
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

  removeTile({ x, y }: BoardLocation): Tile {
    const square = this.squares[x][y];
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

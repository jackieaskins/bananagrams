import Tile, { TileJSON } from './Tile';
import BaseModel from './BaseModel';

export type BoardLocation = {
  x: number;
  y: number;
};
export enum Direction {
  ACROSS = 'ACROSS',
  DOWN = 'DOWN',
}
export type WordInfo = {
  start: BoardLocation;
  valid: boolean;
};
export type BoardSquare = {
  tile: Tile;
  wordInfo: {
    [Direction.ACROSS]?: WordInfo;
    [Direction.DOWN]?: WordInfo;
  };
};
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
    return [...this.squares];
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
      throw new Error(`Board already has tile at position ${x}, ${y}`);
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

  private updateSquare(
    { x, y }: BoardLocation,
    square: BoardSquare | null
  ): void {
    this.squares = [
      ...this.squares.slice(0, x),
      [...this.squares[x].slice(0, y), square, ...this.squares[x].slice(y + 1)],
      ...this.squares.slice(x + 1),
    ];
  }

  removeTile({ x, y }: BoardLocation): Tile {
    const square = this.squares[x][y];

    if (!square) {
      throw new Error(`Board does not have a tile at location ${x}, ${y}`);
    }

    this.updateSquare({ x, y }, null);
    return square.tile;
  }

  addTile(location: BoardLocation, tile: Tile): void {
    this.validateEmptySquare(location);

    this.updateSquare(location, {
      tile,
      wordInfo: {},
    });
  }
}

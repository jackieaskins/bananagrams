import {
  AbstractBoard,
  AbstractBoardSquare,
  Board,
  BoardLocation,
} from "../../types/board";
import { generateBoardKey } from "../boardKey";
import { validateAddTile, validateRemoveTile } from "../boardValidation";
import BaseModel from "./BaseModel";
import TileModel from "./TileModel";

export type BoardSquareModel = AbstractBoardSquare<TileModel>;
export type BoardSquareModels = AbstractBoard<TileModel>;

function initializeBoard(): BoardSquareModels {
  return {};
}

export default class BoardModel implements BaseModel<Board> {
  private squares = initializeBoard();

  getSquares(): BoardSquareModels {
    return Object.fromEntries(
      Object.entries(this.squares).map(([key, square]) => [key, { ...square }]),
    );
  }

  getAllTiles(): TileModel[] {
    return Object.values(this.squares).map(({ tile }) => tile);
  }

  reset(): void {
    this.squares = initializeBoard();
  }

  clear(): TileModel[] {
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

  toJSON(): Board {
    return Object.fromEntries(
      Object.entries(this.squares).map(([key, square]) => [
        key,
        { tile: square.tile.toJSON(), wordInfo: square.wordInfo },
      ]),
    );
  }

  removeTile({ x, y }: BoardLocation): TileModel {
    const square = this.getSquare({ x, y });

    if (!square) {
      throw new Error(`Board does not have a tile at location ${x}, ${y}`);
    }

    const { tile } = square;
    this.squares = validateRemoveTile(this.getSquares(), { x, y });
    return tile;
  }

  addTile(location: BoardLocation, tile: TileModel): void {
    this.validateEmptySquare(location);

    this.squares = validateAddTile(this.getSquares(), location, tile);
  }
}

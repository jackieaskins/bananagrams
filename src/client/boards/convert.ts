import { Board, BoardSquare } from "../../types/board";
import { generateBoardKey } from "./key";

const BOARD_SIZE = 21;

export function convertToArray(board: Board): (BoardSquare | null)[][] {
  const arr = [];

  for (let x = 0; x < BOARD_SIZE; x++) {
    const row = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      row.push(board[generateBoardKey({ x, y })] || null);
    }
    arr.push(row);
  }

  return arr;
}

import { generateBoardKey } from "./key";
import { Board, BoardSquare } from "@/types/board";

const BOARD_SIZE = 21;

export function convertToArray(board: Board): (BoardSquare | null)[][] {
  const arr = [];

  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      row.push(board[generateBoardKey({ x, y })] || null);
    }
    arr.push(row);
  }

  return arr;
}

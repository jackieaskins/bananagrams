import { Board } from './types';

const hasConnectedTile = (board: Board, x: number, y: number): boolean =>
  [
    board[x - 1]?.[y],
    board[x]?.[y - 1],
    board[x + 1]?.[y],
    board[x]?.[y + 1],
  ].some((tile) => tile != null);

export const isConnectedBoard = (board: Board): boolean =>
  board.every((row, x) =>
    row.every((tile, y) => tile === null || hasConnectedTile(board, x, y))
  );

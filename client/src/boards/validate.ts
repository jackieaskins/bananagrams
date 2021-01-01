import { Board, BoardPosition, ValidationStatus, BoardSquare } from './types';

export const isValidConnectedBoard = (board: Board): boolean => {
  const width = board.length;
  const height = board[0].length;

  const getSurroundingTiles = (row: number, col: number): BoardPosition[] =>
    [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ].filter(
      ({ row, col }) => row >= 0 && row < width && col >= 0 && col < height
    );

  const stack: BoardPosition[] = [];
  let connectedComponents = 0;
  const visited = [...Array(width)].map(() => Array(height).fill(false));

  const shouldCheckTile = (row: number, col: number): boolean =>
    board[row][col] != null && !visited[row][col];

  for (let row = 0; row < width; row++) {
    for (let col = 0; col < height; col++) {
      if (shouldCheckTile(row, col)) {
        if (connectedComponents > 0) return false;
        connectedComponents++;

        stack.push({ row, col });
        while (stack.length > 0) {
          const { row, col } = stack.pop() as BoardPosition;
          visited[row][col] = true;

          if (
            Object.values((board[row][col] as BoardSquare).wordInfo).some(
              ({ validation }) => validation === ValidationStatus.INVALID
            )
          ) {
            return false;
          }

          getSurroundingTiles(row, col).forEach(({ row, col }) => {
            if (shouldCheckTile(row, col)) stack.push({ row, col });
          });
        }
      }
    }
  }

  return connectedComponents === 1;
};

import { Board, BoardPosition } from './types';

const surroundingTiles = (x: number, y: number): BoardPosition[] => [
  { x: x - 1, y },
  { x: x + 1, y },
  { x, y: y - 1 },
  { x, y: y + 1 },
];

export const isConnectedBoard = (board: Board): boolean => {
  const width = board.length;
  const height = board[0].length;

  const stack: BoardPosition[] = [];
  let connectedComponents = 0;
  const visited = [...Array(width)].map(() => Array(height).fill(false));

  const shouldCheckTile = (x: number, y: number): boolean =>
    board[x][y] != null && !visited[x][y];

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (shouldCheckTile(x, y)) {
        if (connectedComponents > 0) return false;
        connectedComponents++;

        stack.push({ x, y });
        while (stack.length > 0) {
          const { x, y } = stack.pop() as BoardPosition;
          visited[x][y] = true;

          surroundingTiles(x, y).forEach(({ x, y }) => {
            if (shouldCheckTile(x, y)) stack.push({ x, y });
          });
        }
      }
    }
  }

  return connectedComponents === 1;
};

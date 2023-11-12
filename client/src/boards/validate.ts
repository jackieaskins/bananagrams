import { Board, BoardLocation, ValidationStatus, BoardSquare } from "./types";

export function isValidConnectedBoard(board: Board): boolean {
  const width = board.length;
  const height = board[0].length;

  const getSurroundingTiles = (x: number, y: number): BoardLocation[] =>
    [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ].filter(({ x, y }) => x >= 0 && x < width && y >= 0 && y < height);

  const stack: BoardLocation[] = [];
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
          const { x, y } = stack.pop() as BoardLocation;
          visited[x][y] = true;

          if (
            Object.values((board[x][y] as BoardSquare).wordInfo).some(
              ({ validation }) => validation === ValidationStatus.INVALID,
            )
          ) {
            return false;
          }

          getSurroundingTiles(x, y).forEach(({ x, y }) => {
            if (shouldCheckTile(x, y)) stack.push({ x, y });
          });
        }
      }
    }
  }

  return connectedComponents === 1;
}

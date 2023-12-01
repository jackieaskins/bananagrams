import { generateBoardKey, parseBoardKey } from "./key";
import { Board, BoardLocation, ValidationStatus } from "./types";

export function isValidConnectedBoard(board: Board): boolean {
  const vals = Object.keys(board).map(parseBoardKey);

  const xVals = vals.map(({ x }) => x);
  const minX = Math.min(...xVals);
  const maxX = Math.max(...xVals);

  const yVals = vals.map(({ y }) => y);
  const minY = Math.min(...yVals);
  const maxY = Math.max(...yVals);

  const getSurroundingTiles = ({ x, y }: BoardLocation): BoardLocation[] =>
    [
      { x: x - 1, y },
      { x: x + 1, y },
      { x, y: y - 1 },
      { x, y: y + 1 },
    ].filter(({ x, y }) => x >= minX && x <= maxX && y >= minY && y <= maxY);

  const stack: BoardLocation[] = [];
  let connectedComponents = 0;
  const visited: Record<string, boolean> = {};

  const shouldCheckTile = (location: BoardLocation): boolean => {
    const key = generateBoardKey(location);
    return board[key] != null && !visited[key];
  };

  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (shouldCheckTile({ x, y })) {
        if (connectedComponents > 0) return false;
        connectedComponents++;

        stack.push({ x, y });
        while (stack.length > 0) {
          const location = stack.pop()!;
          const key = generateBoardKey(location);

          visited[key] = true;

          if (
            Object.values(board[key].wordInfo).some(
              ({ validation }) => validation === ValidationStatus.INVALID,
            )
          ) {
            return false;
          }

          getSurroundingTiles(location).forEach((location) => {
            if (shouldCheckTile(location)) stack.push(location);
          });
        }
      }
    }
  }

  return connectedComponents === 1;
}

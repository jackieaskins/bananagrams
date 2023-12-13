import { generateBoardKey, parseBoardKey } from "../boards/key";
import { Board, BoardLocation } from "../boards/types";

type BoardCluster = {
  midX: number;
  midY: number;
  tiles: BoardLocation[];
};

export function getBoardClusters(board: Board): Array<BoardCluster> {
  const clusters: Array<BoardCluster> = [];
  const visited = new Set<string>();

  const boardKeys = Object.keys(board);

  boardKeys.forEach((boardKey) => {
    const cluster = [];
    const stack: string[] = [boardKey];

    while (stack.length) {
      const nextKey = stack.pop()!;

      if (visited.has(nextKey)) {
        continue;
      }
      visited.add(nextKey);

      const { x, y } = parseBoardKey(nextKey);

      cluster.push({ x, y });

      stack.push(
        ...[
          generateBoardKey({ x: x - 1, y }),
          generateBoardKey({ x: x + 1, y }),
          generateBoardKey({ x, y: y - 1 }),
          generateBoardKey({ x, y: y + 1 }),
        ].filter((key) => board[key]),
      );
    }

    if (cluster.length) {
      const ys = cluster.map(({ y }) => y);
      const xs = cluster.map(({ x }) => x);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      clusters.push({
        midY: (minY + maxY + 1) / 2,
        midX: (minX + maxX + 1) / 2,
        tiles: cluster,
      });
    }
  });

  return clusters;
}

import { useMemo } from "react";
import { Arrow, Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { getBoardClusters } from "./boardClusters";
import { useColorHex } from "./useColorHex";
import { Board, BoardLocation } from "@/types/board";

const EDGE_OFFSET = 0.5;

type CanvasOffScreenIndicatorsProps = {
  board: Board;
};

export default function CanvasOffScreenIndicators({
  board,
}: CanvasOffScreenIndicatorsProps): JSX.Element {
  const [arrowColor] = useColorHex(["gray.500"]);
  const { offset, size, tileSize } = useCanvasContext();

  const { boardMinX, boardMaxX, boardMinY, boardMaxY } = useMemo(
    () => ({
      boardMinX: -offset.x / tileSize,
      boardMaxX: (-offset.x + size.width) / tileSize,
      boardMinY: -offset.y / tileSize,
      boardMaxY: (-offset.y + size.height) / tileSize,
    }),
    [offset.x, offset.y, size.height, size.width, tileSize],
  );

  const offScreenBoardClusters = useMemo(() => {
    const isOffScreen = ({ x, y }: BoardLocation) =>
      x < Math.floor(boardMinX) ||
      x > Math.floor(boardMaxX) ||
      y < Math.floor(boardMinY) ||
      y > Math.floor(boardMaxY);

    return getBoardClusters(board)
      .filter(({ tiles }) => tiles.every(isOffScreen))
      .map(({ midX, midY }) => {
        const y =
          Math.max(
            boardMinY + EDGE_OFFSET,
            Math.min(boardMaxY - EDGE_OFFSET, midY),
          ) * tileSize;
        const x =
          Math.max(
            boardMinX + EDGE_OFFSET,
            Math.min(boardMaxX - EDGE_OFFSET, midX),
          ) * tileSize;

        return {
          points: [
            midX < Math.ceil(boardMinX) || midX > Math.floor(boardMaxX)
              ? size.width / 2 - offset.x
              : x,
            midY < Math.ceil(boardMinY) || midY > Math.floor(boardMaxY)
              ? size.height / 2 - offset.y
              : y,
            x,
            y,
          ],
        };
      });
  }, [
    board,
    boardMaxX,
    boardMaxY,
    boardMinX,
    boardMinY,
    offset,
    size,
    tileSize,
  ]);

  return (
    <Group>
      {offScreenBoardClusters.map(({ points }, index) => (
        <Arrow
          key={index}
          fill={arrowColor}
          pointerLength={tileSize / 3}
          pointerWidth={tileSize / 1.5}
          points={points}
          opacity={0.6}
        />
      ))}
    </Group>
  );
}

import { useCallback, useMemo } from "react";
import { Arrow, Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { useActiveBoardSquare } from "@/client/boards/ActiveBoardSquareContext";
import { getBoardClusters } from "@/client/boards/boardClusters";
import { vectorQuotient } from "@/client/boards/vectorMath";
import { useColorHex } from "@/client/utils/useColorHex";
import { Board, BoardLocation } from "@/types/board";

const EDGE_OFFSET = 0.5;

type CanvasOffScreenIndicatorsProps = {
  board: Board;
};

export default function CanvasOffScreenIndicators({
  board,
}: CanvasOffScreenIndicatorsProps): JSX.Element {
  const [arrowColor, activeSquareColor] = useColorHex(["gray.500", "teal.500"]);
  const { offset, size, tileSize } = useCanvasContext();
  const { activeBoardSquare } = useActiveBoardSquare();

  const { boardMinX, boardMaxX, boardMinY, boardMaxY } = useMemo(
    () => ({
      boardMinX: -offset.x / tileSize,
      boardMaxX: (-offset.x + size.width) / tileSize,
      boardMinY: -offset.y / tileSize,
      boardMaxY: (-offset.y + size.height) / tileSize,
    }),
    [offset.x, offset.y, size.height, size.width, tileSize],
  );

  const isOffScreen = useCallback(
    ({ x, y }: BoardLocation) =>
      x < Math.floor(boardMinX) ||
      x > Math.floor(boardMaxX) ||
      y < Math.floor(boardMinY) ||
      y > Math.floor(boardMaxY),
    [boardMaxX, boardMaxY, boardMinX, boardMinY],
  );

  const getClusterPoints = useCallback(
    ({ midX, midY }: { midX: number; midY: number }) => {
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

      return [
        midX < Math.ceil(boardMinX) || midX > Math.floor(boardMaxX)
          ? size.width / 2 - offset.x
          : x,
        midY < Math.ceil(boardMinY) || midY > Math.floor(boardMaxY)
          ? size.height / 2 - offset.y
          : y,
        x,
        y,
      ];
    },
    [
      boardMaxX,
      boardMaxY,
      boardMinX,
      boardMinY,
      offset.x,
      offset.y,
      size.height,
      size.width,
      tileSize,
    ],
  );

  const offScreenBoardClusters = useMemo(
    () =>
      getBoardClusters(board)
        .filter(({ tiles }) => tiles.every(isOffScreen))
        .map(getClusterPoints),
    [board, getClusterPoints, isOffScreen],
  );

  const activeBoardSquarePoints = useMemo(() => {
    if (!activeBoardSquare) return null;

    const { x, y } = vectorQuotient(activeBoardSquare, {
      x: tileSize,
      y: tileSize,
    });

    if (!isOffScreen({ x, y })) return null;

    return getClusterPoints({ midX: x + 0.5, midY: y + 0.5 });
  }, [activeBoardSquare, getClusterPoints, isOffScreen, tileSize]);

  return (
    <Group>
      {activeBoardSquarePoints && (
        <Arrow
          fill={activeSquareColor}
          pointerLength={tileSize / 3}
          pointerWidth={tileSize / 1.5}
          points={activeBoardSquarePoints}
          opacity={0.6}
        />
      )}
      {offScreenBoardClusters.map((points, index) => (
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

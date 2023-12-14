import { useMemo } from "react";
import { Arrow, Group } from "react-konva";
import { BoardLocation } from "../../types/board";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import { getBoardClusters } from "./boardClusters";
import { useColorHex } from "./useColorHex";
import { useCurrentPlayer } from "./useCurrentPlayer";

const EDGE_OFFSET = 0.5;

export default function CanvasOffScreenIndicators(): JSX.Element {
  const [arrowColor] = useColorHex(["gray.500"]);
  const { offset, size } = useCanvasContext();
  const { board } = useCurrentPlayer();

  const { boardMinX, boardMaxX, boardMinY, boardMaxY } = useMemo(
    () => ({
      boardMinX: -offset.x / TILE_SIZE,
      boardMaxX: (-offset.x + size.width) / TILE_SIZE,
      boardMinY: -offset.y / TILE_SIZE,
      boardMaxY: (-offset.y + size.height) / TILE_SIZE,
    }),
    [offset, size],
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
          ) * TILE_SIZE;
        const x =
          Math.max(
            boardMinX + EDGE_OFFSET,
            Math.min(boardMaxX - EDGE_OFFSET, midX),
          ) * TILE_SIZE;

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
  }, [board, boardMaxX, boardMaxY, boardMinX, boardMinY, offset, size]);

  return (
    <Group>
      {offScreenBoardClusters.map(({ points }, index) => (
        <Arrow
          key={index}
          fill={arrowColor}
          pointerLength={10}
          pointerWidth={20}
          points={points}
          opacity={0.6}
        />
      ))}
    </Group>
  );
}

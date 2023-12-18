import { Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./constants";
import { useColorModeHex } from "./useColorHex";

export default function CanvasBoardDragOverlay(): JSX.Element | null {
  const { hoveredBoardPosition } = useCanvasContext();
  const hoverColor = useColorModeHex("gray.300", "gray.500");

  if (!hoveredBoardPosition) {
    return null;
  }

  return (
    <Rect
      x={Math.floor(hoveredBoardPosition.x / TILE_SIZE) * TILE_SIZE}
      y={Math.floor(hoveredBoardPosition.y / TILE_SIZE) * TILE_SIZE}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fill={hoverColor}
      opacity={0.6}
    />
  );
}

import { Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import { useColorModeHex } from "./useColorHex";

export default function CanvasBoardOverlay(): JSX.Element | null {
  const { hoveredBoardPosition, offset } = useCanvasContext();
  const hoverColor = useColorModeHex("gray.300", "gray.500");

  if (!hoveredBoardPosition) {
    return null;
  }

  return (
    <Rect
      x={Math.floor(hoveredBoardPosition.x / TILE_SIZE) * TILE_SIZE + offset.x}
      y={Math.floor(hoveredBoardPosition.y / TILE_SIZE) * TILE_SIZE + offset.y}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fill={hoverColor}
      opacity={0.6}
    />
  );
}

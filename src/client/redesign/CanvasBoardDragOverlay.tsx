import { useMemo } from "react";
import { Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { useSelectedTile } from "./SelectedTileContext";
import { CanvasName, TILE_SIZE } from "./constants";
import { useColorModeHex } from "./useColorHex";

const SUPPORTED_OVERLAY_NAMES = [CanvasName.Board, CanvasName.BoardTile];

export default function CanvasBoardDragOverlay(): JSX.Element | null {
  const { offset, stageRef } = useCanvasContext();
  const { selectedTile } = useSelectedTile();
  const hoverColor = useColorModeHex("gray.300", "gray.500");

  const position = useMemo(() => {
    const pointerPos = stageRef.current?.pointerPos;

    if (!selectedTile || !pointerPos) {
      return null;
    }

    const intersection = stageRef.current?.getIntersection(pointerPos);
    if (
      !intersection ||
      SUPPORTED_OVERLAY_NAMES.includes(intersection.attrs.name)
    ) {
      return {
        x: Math.floor((pointerPos.x - offset.x) / TILE_SIZE) * TILE_SIZE,
        y: Math.floor((pointerPos.y - offset.y) / TILE_SIZE) * TILE_SIZE,
      };
    }

    return null;
  }, [offset.x, offset.y, selectedTile, stageRef]);

  if (!position) {
    return null;
  }

  return (
    <Rect
      x={position.x}
      y={position.y}
      width={TILE_SIZE}
      height={TILE_SIZE}
      fill={hoverColor}
      opacity={0.6}
      listening={false}
    />
  );
}

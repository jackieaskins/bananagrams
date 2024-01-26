import { useMemo } from "react";
import { Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { Attrs, CanvasName } from "./constants";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { useColorModeHex } from "@/client/utils/useColorHex";

const SUPPORTED_OVERLAY_NAMES = [CanvasName.Board, CanvasName.BoardTile];

export default function CanvasBoardDragOverlay(): JSX.Element | null {
  const { offset, stageRef, tileSize } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();
  const hoverColor = useColorModeHex("gray.300", "gray.500");

  const position = useMemo(() => {
    const pointerPos = stageRef.current?.pointerPos;

    if (!selectedTiles || !pointerPos) {
      return null;
    }

    const intersection = stageRef.current?.getIntersection(pointerPos);
    const name = (intersection?.attrs as Attrs).name;
    if (!intersection || (name && SUPPORTED_OVERLAY_NAMES.includes(name))) {
      return {
        x: Math.floor((pointerPos.x - offset.x) / tileSize) * tileSize,
        y: Math.floor((pointerPos.y - offset.y) / tileSize) * tileSize,
      };
    }

    return null;
  }, [offset.x, offset.y, selectedTiles, stageRef, tileSize]);

  if (!position) {
    return null;
  }

  return (
    <Rect
      x={position.x}
      y={position.y}
      width={tileSize}
      height={tileSize}
      fill={hoverColor}
      opacity={0.5}
      listening={false}
    />
  );
}

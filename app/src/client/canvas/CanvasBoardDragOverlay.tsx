import { useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import CanvasTileRect from "./CanvasTileRect";
import { Attrs, CanvasName } from "./constants";
import { generateBoardKey } from "@/client/boards/key";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { useColorModeHex } from "@/client/utils/useColorHex";

const SUPPORTED_OVERLAY_NAMES = [CanvasName.Board, CanvasName.BoardTile];

export default function CanvasBoardDragOverlay(): JSX.Element[] {
  const { offset, stageRef, tileSize } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();
  const { board } = useCurrentPlayer();
  const hoverColor = useColorModeHex("gray.300", "gray.500");

  const overlays = useMemo(() => {
    const pointerPos = stageRef.current?.pointerPos;

    if (!selectedTiles || !pointerPos) {
      return [];
    }

    const intersection = stageRef.current?.getIntersection(pointerPos);
    const name = (intersection?.attrs as Attrs).name;
    if (!intersection || (name && SUPPORTED_OVERLAY_NAMES.includes(name))) {
      const position = {
        x: Math.floor((pointerPos.x - offset.x) / tileSize),
        y: Math.floor((pointerPos.y - offset.y) / tileSize),
      };

      const selectedTileIds = new Set(
        selectedTiles.tiles.map(({ tile: { id } }) => id),
      );

      return selectedTiles.tiles.map(({ followOffset }) => {
        const x = position.x + followOffset.x;
        const y = position.y + followOffset.y;

        const key = generateBoardKey({ x, y });
        const tileAtSquare = board[key];

        return {
          key,
          x: x * tileSize,
          y: y * tileSize,
          color:
            tileAtSquare &&
            selectedTileIds.size > 1 &&
            !selectedTileIds.has(tileAtSquare.tile.id)
              ? "red"
              : hoverColor,
        };
      });
    }

    return [];
  }, [board, hoverColor, offset, selectedTiles, stageRef, tileSize]);

  return overlays.map(({ x, y, key, color }) => (
    <CanvasTileRect
      key={key}
      x={x}
      y={y}
      fill={color}
      stroke={color}
      opacity={0.5}
      listening={false}
    />
  ));
}

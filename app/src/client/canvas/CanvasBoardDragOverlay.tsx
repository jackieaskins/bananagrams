import { useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import CanvasTileRect from "./CanvasTileRect";
import { Attrs, CanvasName } from "./constants";
import { generateBoardKey } from "@/client/boards/key";
import { useKeys } from "@/client/keys/KeysContext";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import getRotatedLocation from "@/client/tiles/getRotatedLocation";
import { useColorModeHex } from "@/client/utils/useColorHex";

const SUPPORTED_OVERLAY_NAMES = [
  CanvasName.Board,
  CanvasName.BoardTile,
  CanvasName.SelectRect,
];

export default function CanvasBoardDragOverlay(): JSX.Element[] {
  const { offset, stageRef, tileSize, cursorPosition } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();
  const { board } = useCurrentPlayer();
  const hoverColor = useColorModeHex("gray.300", "gray.500");
  const { shiftDown } = useKeys();

  const overlays = useMemo(() => {
    if (!selectedTiles) {
      return [];
    }

    const intersection = stageRef.current?.getIntersection(cursorPosition);
    const name = (intersection?.attrs as Attrs).name;
    if (!intersection || (name && SUPPORTED_OVERLAY_NAMES.includes(name))) {
      const position = {
        x: Math.floor((cursorPosition.x - offset.x) / tileSize),
        y: Math.floor((cursorPosition.y - offset.y) / tileSize),
      };

      const { tiles, rotation } = selectedTiles;

      const selectedTileIds = new Set(tiles.map(({ tile: { id } }) => id));

      return tiles.map(({ relativeLocation }) => {
        const rotatedLocation = getRotatedLocation(rotation, relativeLocation);
        const x = position.x + rotatedLocation.x;
        const y = position.y + rotatedLocation.y;

        const key = generateBoardKey({ x, y });
        const tileAtSquare = board[key];

        return {
          key,
          x: x * tileSize,
          y: y * tileSize,
          color:
            tileAtSquare &&
            !shiftDown &&
            selectedTileIds.size > 1 &&
            !selectedTileIds.has(tileAtSquare.tile.id)
              ? "red"
              : hoverColor,
        };
      });
    }

    return [];
  }, [
    board,
    cursorPosition,
    hoverColor,
    offset.x,
    offset.y,
    selectedTiles,
    shiftDown,
    stageRef,
    tileSize,
  ]);

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

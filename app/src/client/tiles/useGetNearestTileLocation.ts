import { useCallback } from "react";
import { SelectedTile } from "./SelectedTilesContext";
import { vectorDist } from "@/client/boards/vectorMath";
import { useCanvasContext } from "@/client/canvas/CanvasContext";
import { BoardLocation } from "@/types/board";

export default function useGetNearestTileLocation(): (
  tiles: SelectedTile[],
) => BoardLocation | null {
  const { cursorPosition, offset, tileSize } = useCanvasContext();

  return useCallback(
    (tiles: SelectedTile[]) => {
      const tileDistances = tiles.map((tile) => ({
        ...tile,
        distance: tile.boardLocation
          ? vectorDist(tile.boardLocation, {
              x: (cursorPosition.x - offset.x) / tileSize,
              y: (cursorPosition.y - offset.y) / tileSize,
            })
          : -1,
      }));

      const minDistance = Math.min(
        ...tileDistances.map(({ distance }) => distance),
      );

      const nearestTileBoardLocation =
        minDistance === -1
          ? null
          : tileDistances.find(({ distance }) => distance === minDistance)
              ?.boardLocation ?? null;

      return nearestTileBoardLocation;
    },
    [cursorPosition.x, cursorPosition.y, offset.x, offset.y, tileSize],
  );
}

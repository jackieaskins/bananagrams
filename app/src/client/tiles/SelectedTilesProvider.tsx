import { useCallback, useMemo, useState } from "react";
import {
  SelectedTile,
  SelectedTiles,
  SelectedTilesContext,
} from "./SelectedTilesContext";
import { vectorDiff, vectorDist } from "@/client/boards/vectorMath";
import { useCanvasContext } from "@/client/canvas/CanvasContext";

type SelectedTilesProviderProps = {
  children: React.ReactNode;
};

export default function SelectedTilesProvider({
  children,
}: SelectedTilesProviderProps): JSX.Element {
  const { cursorPosition, offset, tileSize } = useCanvasContext();
  const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
    null,
  );

  const clearSelectedTiles = useCallback(() => {
    setSelectedTiles(null);
  }, []);

  // This makes an assumption that all tiles will be in hand or on board, but never both
  const selectTiles = useCallback(
    (tiles: SelectedTile[]) => {
      if (!tiles.length) return;

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

      setSelectedTiles({
        boardLocation: nearestTileBoardLocation,
        tiles: tiles.map(({ boardLocation, tile }, index) => {
          const followOffset =
            nearestTileBoardLocation && boardLocation
              ? vectorDiff(boardLocation, nearestTileBoardLocation)
              : { x: index, y: 0 };

          return { tile, followOffset, relativePosition: followOffset };
        }),
      });
    },
    [cursorPosition.x, cursorPosition.y, offset.x, offset.y, tileSize],
  );

  const rotatedSelectedTiles = useCallback(() => {
    setSelectedTiles((selectedTiles) => {
      if (!selectedTiles) {
        return null;
      }

      return {
        ...selectedTiles,
        tiles: selectedTiles.tiles.map(
          ({ followOffset, relativePosition, tile }) => ({
            tile,
            relativePosition,
            followOffset: { x: -followOffset.y, y: followOffset.x },
          }),
        ),
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      clearSelectedTiles,
      selectTiles,
      rotatedSelectedTiles,
      selectedTiles,
    }),
    [clearSelectedTiles, rotatedSelectedTiles, selectTiles, selectedTiles],
  );

  return (
    <SelectedTilesContext.Provider value={value}>
      {children}
    </SelectedTilesContext.Provider>
  );
}

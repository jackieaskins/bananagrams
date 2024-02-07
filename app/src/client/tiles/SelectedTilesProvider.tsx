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

          return { tile, followOffset };
        }),
      });
    },
    [cursorPosition.x, cursorPosition.y, offset.x, offset.y, tileSize],
  );

  const expandSelection = useCallback((tiles: SelectedTile[]) => {
    setSelectedTiles((selectedTiles) => {
      if (!selectedTiles) return null;

      const { followOffset: lastFollowOffset } =
        selectedTiles.tiles[selectedTiles.tiles.length - 1];

      return {
        ...selectedTiles,
        tiles: [
          ...selectedTiles.tiles,
          ...tiles.map(({ tile, boardLocation }) => ({
            tile,
            followOffset:
              boardLocation && selectedTiles.boardLocation
                ? vectorDiff(boardLocation, selectedTiles.boardLocation)
                : {
                    x: lastFollowOffset.x === 0 ? 0 : lastFollowOffset.x + 1,
                    y: lastFollowOffset.y === 0 ? 0 : lastFollowOffset.y + 1,
                  },
          })),
        ],
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      clearSelectedTiles,
      expandSelection,
      selectTiles,
      selectedTiles,
    }),
    [clearSelectedTiles, expandSelection, selectTiles, selectedTiles],
  );

  return (
    <SelectedTilesContext.Provider value={value}>
      {children}
    </SelectedTilesContext.Provider>
  );
}

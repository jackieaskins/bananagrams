import { KonvaEventObject } from "konva/lib/Node";
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

function getFollowPosition(e: KonvaEventObject<PointerEvent>) {
  return { x: e.evt.x, y: e.evt.y };
}

export default function SelectedTilesProvider({
  children,
}: SelectedTilesProviderProps): JSX.Element {
  const { offset, tileSize } = useCanvasContext();
  const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
    null,
  );

  const clearSelectedTiles = useCallback(() => {
    setSelectedTiles(null);
  }, []);

  // This makes an assumption that all tiles will be in hand or on board, but never both
  const selectTiles = useCallback(
    (e: KonvaEventObject<PointerEvent>, tiles: SelectedTile[]) => {
      if (!tiles.length) return;

      const followPosition = getFollowPosition(e);
      const tileDistances = tiles.map((tile) => ({
        ...tile,
        distance: tile.boardLocation
          ? vectorDist(tile.boardLocation, {
              x: (followPosition.x - offset.x) / tileSize,
              y: (followPosition.y - offset.y) / tileSize,
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
        followPosition,
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
    [offset.x, offset.y, tileSize],
  );

  const updateFollowPosition = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      setSelectedTiles((selectedTiles) => {
        if (selectedTiles) {
          return {
            ...selectedTiles,
            followPosition: getFollowPosition(e),
          };
        }

        return null;
      });
    },
    [],
  );

  const expandSelection = useCallback(
    (e: KonvaEventObject<PointerEvent>, tiles: SelectedTile[]) => {
      setSelectedTiles((selectedTiles) => {
        if (!selectedTiles) return null;

        const { followOffset: lastFollowOffset } =
          selectedTiles.tiles[selectedTiles.tiles.length - 1];

        return {
          ...selectedTiles,
          followPosition: getFollowPosition(e),
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
    },
    [],
  );

  const value = useMemo(
    () => ({
      clearSelectedTiles,
      expandSelection,
      selectTiles,
      selectedTiles,
      updateFollowPosition,
    }),
    [
      clearSelectedTiles,
      expandSelection,
      selectTiles,
      selectedTiles,
      updateFollowPosition,
    ],
  );

  return (
    <SelectedTilesContext.Provider value={value}>
      {children}
    </SelectedTilesContext.Provider>
  );
}

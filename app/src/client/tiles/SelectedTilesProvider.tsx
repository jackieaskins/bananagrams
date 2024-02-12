import { useToast } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import {
  SelectedTile,
  SelectedTiles,
  SelectedTilesContext,
} from "./SelectedTilesContext";
import useGetNearestTileLocation from "./useGetNearestTileLocation";
import { vectorDiff } from "@/client/boards/vectorMath";

type SelectedTilesProviderProps = {
  children: React.ReactNode;
};

export default function SelectedTilesProvider({
  children,
}: SelectedTilesProviderProps): JSX.Element {
  const toast = useToast();
  const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
    null,
  );
  const getNearestTileLocation = useGetNearestTileLocation();

  const clearSelectedTiles = useCallback(() => {
    setSelectedTiles(null);
  }, []);

  // This makes an assumption that all tiles will be in hand or on board, but never both
  const selectTiles = useCallback(
    (tiles: SelectedTile[], expand: boolean) => {
      if (!tiles.length) return;

      setSelectedTiles((selectedTiles) => {
        if (selectedTiles) {
          if (
            selectedTiles.boardLocation &&
            tiles.some(({ boardLocation }) => !boardLocation)
          ) {
            toast({
              description:
                "Current selection contains board tiles and cannot be expanded with tiles from your hand",
              status: "error",
            });
            return selectedTiles;
          }

          if (
            !selectedTiles.boardLocation &&
            tiles.some(({ boardLocation }) => boardLocation)
          ) {
            toast({
              description:
                "Current selection contains hand tiles and cannot be expanded with tiles from your board",
              status: "error",
            });
            return selectedTiles;
          }
        }

        const existingTiles =
          expand && selectedTiles ? selectedTiles.tiles : [];

        const newTiles = tiles.filter(({ tile: { id } }) =>
          existingTiles.every(({ tile }) => tile.id !== id),
        );

        const anchorBoardLocation =
          selectedTiles?.boardLocation ?? getNearestTileLocation(tiles);

        return {
          boardLocation: anchorBoardLocation,
          rotation: selectedTiles?.rotation ?? 0,
          tiles: [
            ...existingTiles,
            ...newTiles.map(({ boardLocation, tile }, index) => ({
              tile,
              relativeLocation:
                anchorBoardLocation && boardLocation
                  ? vectorDiff(boardLocation, anchorBoardLocation)
                  : { x: existingTiles.length + index, y: 0 },
            })),
          ],
        };
      });
    },
    [getNearestTileLocation, toast],
  );

  const deselectTiles = useCallback(
    (tileIds: string[]) => {
      setSelectedTiles((selectedTiles) => {
        if (!selectedTiles) {
          toast({
            description: "Nothing to remove, you haven't selected any tiles",
            status: "error",
          });
          return selectedTiles;
        }

        const selectedTileIds = new Set(
          selectedTiles.tiles.map(({ tile: { id } }) => id),
        );
        if (tileIds.some((id) => !selectedTileIds.has(id))) {
          toast({
            description: "You don't currently have this tile selected",
            status: "error",
          });
          return selectedTiles;
        }

        const tileIdsToRemove = new Set(tileIds);

        if (!selectedTiles.boardLocation) {
          const newTiles = selectedTiles.tiles.filter(
            ({ tile: { id } }) => !tileIdsToRemove.has(id),
          );

          if (!newTiles.length) {
            return null;
          }

          return {
            ...selectedTiles,
            tiles: newTiles.map(({ tile }, index) => ({
              tile,
              relativeLocation: { x: index, y: 0 },
            })),
          };
        }

        const newTiles = selectedTiles.tiles.filter(
          ({ tile: { id } }) => !tileIdsToRemove.has(id),
        );

        if (!newTiles.length) return null;

        return { ...selectedTiles, tiles: newTiles };
      });
    },
    [toast],
  );

  const rotateSelectedTiles = useCallback((diff: -1 | 1) => {
    setSelectedTiles((selectedTiles) => {
      if (!selectedTiles) {
        return null;
      }

      return { ...selectedTiles, rotation: selectedTiles.rotation + diff };
    });
  }, []);

  const value = useMemo(
    () => ({
      clearSelectedTiles,
      selectTiles,
      deselectTiles,
      rotateSelectedTiles,
      selectedTiles,
    }),
    [
      clearSelectedTiles,
      deselectTiles,
      rotateSelectedTiles,
      selectTiles,
      selectedTiles,
    ],
  );

  return (
    <SelectedTilesContext.Provider value={value}>
      {children}
    </SelectedTilesContext.Provider>
  );
}

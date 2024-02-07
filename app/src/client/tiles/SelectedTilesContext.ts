import { createContext, useContext } from "react";
import { BoardLocation } from "@/types/board";
import { Tile } from "@/types/tile";

export type SelectedTile = {
  tile: Tile;
  boardLocation: BoardLocation | null;
};
export type SelectedTiles = {
  tiles: Array<{
    tile: Tile;
    relativeLocation: BoardLocation;
  }>;
  boardLocation: BoardLocation | null;
  rotation: number;
};

type SelectedTilesState = {
  selectedTiles: SelectedTiles | null;
  clearSelectedTiles: () => void;
  selectTiles: (tiles: SelectedTile[]) => void;
  rotateSelectedTiles: (diff: -1 | 1) => void;
};

export const SelectedTilesContext = createContext<SelectedTilesState>(
  {} as SelectedTilesState,
);

export function useSelectedTiles(): SelectedTilesState {
  return useContext(SelectedTilesContext);
}

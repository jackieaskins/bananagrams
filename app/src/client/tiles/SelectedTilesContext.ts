import { Vector2d } from "konva/lib/types";
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
    followOffset: Vector2d;
    relativePosition: Vector2d;
  }>;
  boardLocation: BoardLocation | null;
};

type SelectedTilesState = {
  selectedTiles: SelectedTiles | null;
  clearSelectedTiles: () => void;
  selectTiles: (tiles: SelectedTile[]) => void;
  rotatedSelectedTiles: () => void;
};

export const SelectedTilesContext = createContext<SelectedTilesState>(
  {} as SelectedTilesState,
);

export function useSelectedTiles(): SelectedTilesState {
  return useContext(SelectedTilesContext);
}

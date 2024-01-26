import { Vector2d } from "konva/lib/types";
import { createContext, useContext } from "react";
import { SetState } from "@/client/state/types";
import { BoardLocation } from "@/types/board";
import { Tile } from "@/types/tile";

export type SelectedTiles = {
  tiles: Array<{
    tile: Tile;
    location: BoardLocation | null;
    followOffset: Vector2d;
  }>;
  followPosition: Vector2d;
};

type SelectedTilesState = {
  selectedTiles: SelectedTiles | null;
  setSelectedTiles: SetState<SelectedTiles | null>;
};

export const SelectedTilesContext = createContext<SelectedTilesState>(
  {} as SelectedTilesState,
);

export function useSelectedTiles(): SelectedTilesState {
  return useContext(SelectedTilesContext);
}

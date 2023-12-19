import { Vector2d } from "konva/lib/types";
import { createContext, useContext } from "react";
import { BoardLocation } from "../../types/board";
import { Tile } from "../../types/tile";
import { SetState } from "../state/types";

export type SelectedTile = {
  tile: Tile;
  location: BoardLocation | null;
  followPosition: Vector2d;
};
type SelectedTileState = {
  selectedTile: SelectedTile | null;
  setSelectedTile: SetState<SelectedTile | null>;
};

export const SelectedTileContext = createContext<SelectedTileState>(
  {} as SelectedTileState,
);

export function useSelectedTile(): SelectedTileState {
  return useContext(SelectedTileContext);
}

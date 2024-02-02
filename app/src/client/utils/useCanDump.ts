import { useMemo } from "react";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

export const EXCHANGE_COUNT = 3;

export default function useCanDump(): boolean {
  const { selectedTiles } = useSelectedTiles();
  const {
    gameInfo: { bunch },
  } = useGame();

  return useMemo(
    () =>
      !!selectedTiles &&
      bunch.length >= EXCHANGE_COUNT * selectedTiles.tiles.length,
    [bunch.length, selectedTiles],
  );
}

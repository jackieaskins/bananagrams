import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import CanvasTile from "./CanvasTile";
import { CanvasName } from "./constants";
import { vectorSum } from "@/client/boards/vectorMath";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { Tile } from "@/types/tile";

type CanvasHandTileProps = {
  tile: Tile;
  x: number;
  y: number;
  onPointerEnter: (event: KonvaEventObject<PointerEvent>) => void;
};

export default function CanvasHandTile({
  tile,
  x,
  y,
  onPointerEnter,
}: CanvasHandTileProps): JSX.Element {
  const { selectedTiles, clearSelectedTiles, selectTiles } = useSelectedTiles();
  const { handleMoveTilesFromBoardToHand } = useGame();

  const handlePointerClick = useCallback(() => {
    /**
     * No tile is selected:
     * - Select the tile under the cursor with no location
     * - Set cursor to grabbing
     *
     * Current tile is selected:
     * - Deselect tile
     * - Set cursor to grab
     *
     * Current tile is on the board:
     * - Call moveTilesFromBoardToHand
     * - ~~Select the tile under the cursor with board location~~ Deslect tile
     * - Set the cursor to ~~grabbing~~ grab
     *
     * Current tile is in the hand:
     * - ~~Select the tile under the cursor with no location~~ Deselect tile
     * - Set cursor to ~~grabbing~~ grab
     */
    if (!selectedTiles) {
      selectTiles([{ tile, boardLocation: null }]);
      return;
    }

    const { boardLocation, tiles } = selectedTiles;

    if (boardLocation) {
      handleMoveTilesFromBoardToHand(
        tiles.map(({ followOffset }) => vectorSum(boardLocation, followOffset)),
      );
    }

    clearSelectedTiles();
  }, [
    clearSelectedTiles,
    handleMoveTilesFromBoardToHand,
    selectTiles,
    selectedTiles,
    tile,
  ]);

  return (
    <CanvasTile
      name={CanvasName.HandTile}
      tile={tile}
      x={x}
      y={y}
      onPointerClick={handlePointerClick}
      onPointerEnter={onPointerEnter}
    />
  );
}

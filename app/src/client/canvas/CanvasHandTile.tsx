import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import CanvasTile from "./CanvasTile";
import { CanvasName } from "./constants";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { setCursor } from "@/client/utils/setCursor";
import { BoardLocation } from "@/types/board";
import { Tile } from "@/types/tile";

type CanvasHandTileProps = {
  tile: Tile;
  x: number;
  y: number;
  onPointerEnter: (event: KonvaEventObject<MouseEvent>) => void;
};

export default function CanvasHandTile({
  tile,
  x,
  y,
  onPointerEnter,
}: CanvasHandTileProps): JSX.Element {
  const { selectedTiles, setSelectedTiles } = useSelectedTiles();
  const { handleMoveTilesFromBoardToHand } = useGame();

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
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
        setSelectedTiles({
          tiles: [{ tile, location: null, followOffset: { x: 0, y: 0 } }],
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      const boardLocations = selectedTiles.tiles
        .map(({ location }) => location)
        .filter((location) => !!location) as BoardLocation[];
      if (boardLocations.length) {
        handleMoveTilesFromBoardToHand(boardLocations);
      }

      setSelectedTiles(null);
      setCursor(e, "grab");
    },
    [handleMoveTilesFromBoardToHand, selectedTiles, setSelectedTiles, tile],
  );

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

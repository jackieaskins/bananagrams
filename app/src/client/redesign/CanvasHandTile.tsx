import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import CanvasTile from "./CanvasTile";
import { useSelectedTile } from "./SelectedTileContext";
import { CanvasName } from "./constants";
import { setCursor } from "./setCursor";
import { useGame } from "@/client/games/GameContext";
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
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileFromBoardToHand } = useGame();

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
       * - Call moveTileFromBoardToHand
       * - ~~Select the tile under the cursor with board location~~ Deslect tile
       * - Set the cursor to ~~grabbing~~ grab
       *
       * Current tile is in the hand:
       * - ~~Select the tile under the cursor with no location~~ Deselect tile
       * - Set cursor to ~~grabbing~~ grab
       */
      if (!selectedTile) {
        setSelectedTile({
          tile,
          location: null,
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      if (selectedTile.location) {
        handleMoveTileFromBoardToHand(selectedTile.location);
      }

      setSelectedTile(null);
      setCursor(e, "grab");
    },
    [handleMoveTileFromBoardToHand, selectedTile, setSelectedTile, tile],
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

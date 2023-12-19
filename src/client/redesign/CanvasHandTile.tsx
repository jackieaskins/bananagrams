import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import { Tile } from "../../types/tile";
import { useGame } from "../games/GameContext";
import CanvasTile from "./CanvasTile";
import { useSelectedTile } from "./SelectedTileContext";
import { CanvasName } from "./constants";
import { setCursor } from "./setCursor";

type CanvasHandTileProps = {
  tile: Tile;
  x: number;
  y: number;
};

export default function CanvasHandTile({
  tile,
  x,
  y,
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
       * - Select the tile under the cursor with board location
       * - Set the cursor to grabbing
       *
       * Current tile is in the hand:
       * - Select the tile under the cursor with no location
       * - Set cursor to grabbing
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

      if (selectedTile.tile.id === tile.id) {
        setSelectedTile(null);
        setCursor(e, "grab");
        return;
      }

      if (selectedTile.location) {
        handleMoveTileFromBoardToHand(selectedTile.location);
        setSelectedTile({
          tile,
          location: selectedTile.location,
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      setSelectedTile({
        tile,
        location: null,
        followPosition: { x: e.evt.x, y: e.evt.y },
      });
      setCursor(e, "grabbing");
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
    />
  );
}

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

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (selectedTile?.location) {
        handleMoveTileFromBoardToHand(selectedTile.location);
      }

      setSelectedTile({
        tile,
        location: selectedTile?.location ?? null,
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
      onClick={handleClick}
    />
  );
}

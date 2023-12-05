import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useCallback, useRef } from "react";
import { BoardLocation } from "../boards/types";
import { useGame } from "../games/GameContext";
import { Tile } from "../tiles/types";
import { useCanvasContext } from "./CanvasContext";
import CanvasTile from "./CanvasTile";

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
  const tileRef = useRef<Konva.Group>(null);
  const { handRectRef } = useCanvasContext();
  const { handleMoveTileFromHandToBoard } = useGame();

  const handleDragEnd = useCallback(
    (pointerPosition: Vector2d, boardPosition: BoardLocation) => {
      if (handRectRef.current?.intersects(pointerPosition)) {
        tileRef.current?.position({ x, y });
      } else {
        handleMoveTileFromHandToBoard(tile.id, boardPosition);
      }
    },
    [handRectRef, handleMoveTileFromHandToBoard, tile.id, x, y],
  );

  return (
    <CanvasTile
      tile={tile}
      x={x}
      y={y}
      tileRef={tileRef}
      onDragEnd={handleDragEnd}
    />
  );
}

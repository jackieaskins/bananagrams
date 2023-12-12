import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useCallback, useRef } from "react";
import { BoardLocation } from "../boards/types";
import { useGame } from "../games/GameContext";
import { useSocket } from "../socket/SocketContext";
import { Tile } from "../tiles/types";
import { HAND_TILE_DRAG_LAYER } from "./Canvas";
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
  const { dumpZoneRectRef, handRectRef } = useCanvasContext();
  const { handleMoveTileFromHandToBoard } = useGame();
  const { socket } = useSocket();

  const handleDragEnd = useCallback(
    (pointerPosition: Vector2d, boardPosition: BoardLocation) => {
      if (dumpZoneRectRef.current?.intersects(pointerPosition)) {
        socket.emit("dump", { tileId: tile.id, boardLocation: null });
      } else if (handRectRef.current?.intersects(pointerPosition)) {
        tileRef.current?.position({ x, y });
      } else {
        handleMoveTileFromHandToBoard(tile.id, boardPosition);
      }
    },
    [
      dumpZoneRectRef,
      handRectRef,
      handleMoveTileFromHandToBoard,
      socket,
      tile.id,
      x,
      y,
    ],
  );

  return (
    <CanvasTile
      dragLayer={HAND_TILE_DRAG_LAYER}
      tile={tile}
      x={x}
      y={y}
      tileRef={tileRef}
      onDragEnd={handleDragEnd}
    />
  );
}

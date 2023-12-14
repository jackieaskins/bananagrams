import Konva from "konva";
import { useCallback, useRef } from "react";
import { BoardLocation } from "../boards/types";
import { useGame } from "../games/GameContext";
import { useSocket } from "../socket/SocketContext";
import { Tile } from "../tiles/types";
import { HAND_TILE_DRAG_LAYER } from "./Canvas";
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
  const { handleMoveTileFromHandToBoard } = useGame();
  const { socket } = useSocket();

  const handleDump = useCallback(() => {
    socket.emit("dump", { tileId: tile.id, boardLocation: null });
  }, [socket, tile.id]);

  const handleHandMove = useCallback(() => {
    tileRef.current?.position({ x, y });
  }, [x, y]);

  const handleBoardMove = useCallback(
    (boardLocation: BoardLocation) => {
      handleMoveTileFromHandToBoard(tile.id, boardLocation);
    },
    [handleMoveTileFromHandToBoard, tile.id],
  );

  return (
    <CanvasTile
      dragLayer={HAND_TILE_DRAG_LAYER}
      tile={tile}
      x={x}
      y={y}
      tileRef={tileRef}
      onDump={handleDump}
      onHandMove={handleHandMove}
      onBoardMove={handleBoardMove}
      fireHandDragEvents={false}
    />
  );
}

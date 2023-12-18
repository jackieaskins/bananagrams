import Konva from "konva";
import { useCallback, useRef } from "react";
import { BoardLocation } from "../../types/board";
import { ClientToServerEventName } from "../../types/socket";
import { Tile } from "../../types/tile";
import { useGame } from "../games/GameContext";
import { socket } from "../socket";
import CanvasTile from "./CanvasTile";
import { HAND_TILE_DRAG_LAYER } from "./constants";

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

  const handleDump = useCallback(() => {
    socket.emit(ClientToServerEventName.Dump, {
      tileId: tile.id,
      boardLocation: null,
    });
  }, [tile.id]);

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

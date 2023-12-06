import { useEffect, useState } from "react";
import { Layer, Stage } from "react-konva";
import { parseBoardKey } from "../boards/key";
import { SetState } from "../state/types";
import CanvasBoard from "./CanvasBoard";
import CanvasBoardTile from "./CanvasBoardTile";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasHand from "./CanvasHand";
import { useCurrentPlayer } from "./useCurrentPlayer";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export const BOARD_TILE_DRAG_LAYER = "board-tile-drag-layer";
export const HAND_TILE_DRAG_LAYER = "hand-tile-drag-layer";

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { handRectRef, size, stageRef, offset } = useCanvasContext();
  const [{ handX, handY }, setHandPosition] = useState({ handX: 0, handY: 0 });
  const { board } = useCurrentPlayer();

  useEffect(() => {
    const handPosition = handRectRef.current?.getParent()?.getPosition();

    if (handPosition) {
      setHandPosition({ handX: handPosition.x, handY: handPosition.y });
    }
  }, [handRectRef, size]);

  return (
    <Stage width={size.width} height={size.height} ref={stageRef}>
      <Layer>
        <CanvasBoard setOffset={setOffset} />

        {Object.entries(board).map(([boardKey, boardSquare]) => {
          const { x, y } = parseBoardKey(boardKey);
          return (
            <CanvasBoardTile
              key={`${boardSquare.tile.id}-${boardKey}`}
              boardSquare={boardSquare}
              x={x * TILE_SIZE + offset.x}
              y={y * TILE_SIZE + offset.y}
            />
          );
        })}

        <CanvasHand />
      </Layer>

      {/* Ensure dragging tiles appear above the other layer */}
      <Layer name={BOARD_TILE_DRAG_LAYER} />
      <Layer name={HAND_TILE_DRAG_LAYER} x={handX} y={handY} />
    </Stage>
  );
}

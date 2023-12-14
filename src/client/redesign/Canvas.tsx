import { Layer, Stage } from "react-konva";
import { SetState } from "../state/types";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHand from "./CanvasHand";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export const BOARD_TILE_DRAG_LAYER = "board-tile-drag-layer";
export const HAND_TILE_DRAG_LAYER = "hand-tile-drag-layer";

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { handLocation, offset, size, stageRef } = useCanvasContext();

  return (
    <Stage width={size.width} height={size.height} ref={stageRef}>
      <Layer>
        <CanvasBoard setOffset={setOffset} />
        <CanvasHand />
      </Layer>

      {/* Ensure dragging tiles appear above the other layer */}
      <Layer
        name={BOARD_TILE_DRAG_LAYER}
        x={offset.x}
        y={offset.y}
        listening={false}
      />
      <Layer
        name={HAND_TILE_DRAG_LAYER}
        x={handLocation.x}
        y={handLocation.y}
        listening={false}
      />
    </Stage>
  );
}

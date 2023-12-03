import { Layer, Stage } from "react-konva";
import { parseBoardKey } from "../boards/key";
import { SetState } from "../state/types";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHand from "./CanvasHand";
import CanvasTile from "./CanvasTile";
import { useCurrentPlayer } from "./useCurrentPlayer";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { size, stageRef, offset } = useCanvasContext();
  const { board } = useCurrentPlayer();

  return (
    <Stage width={size.width} height={size.height} ref={stageRef}>
      <Layer>
        <CanvasBoard setOffset={setOffset} />

        {Object.entries(board).map(([boardKey, { tile }]) => {
          const { x, y } = parseBoardKey(boardKey);
          return (
            <CanvasTile
              position="board"
              key={`${tile.id}-${boardKey}`}
              tile={tile}
              x={x + offset.x}
              y={y + offset.y}
            />
          );
        })}

        <CanvasHand />
      </Layer>
    </Stage>
  );
}

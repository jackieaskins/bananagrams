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

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { size, stageRef, offset } = useCanvasContext();
  const { board } = useCurrentPlayer();

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
    </Stage>
  );
}

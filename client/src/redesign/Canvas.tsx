import { Layer, Stage } from "react-konva";
import { SetState } from "../state/types";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { size, stageRef } = useCanvasContext();

  return (
    <Stage width={size.width} height={size.height} ref={stageRef}>
      <Layer>
        <CanvasBoard setOffset={setOffset} />
      </Layer>
    </Stage>
  );
}

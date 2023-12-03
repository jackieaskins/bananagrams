import { Group, Rect } from "react-konva";
import { SetState } from "../state/types";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import { setCursorWrapper } from "./setCursor";

type BoardProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function CanvasBoard({ setOffset }: BoardProps): JSX.Element {
  const { boardRectRef, offset, size } = useCanvasContext();

  return (
    <Group
      draggable
      onDragMove={(event) => {
        setOffset({ x: event.target.attrs.x, y: event.target.attrs.y });
      }}
    >
      <Rect
        ref={boardRectRef}
        x={-offset.x}
        y={-offset.y}
        width={size.width}
        height={size.height}
        onMouseEnter={setCursorWrapper("move")}
      />

      <CanvasGrid width={size.width} height={size.height} />
    </Group>
  );
}

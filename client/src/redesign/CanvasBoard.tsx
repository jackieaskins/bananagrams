import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import { setCursorWrapper } from "./setCursor";

type BoardProps = {
  setOffset: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
};

export default function CanvasBoard({ setOffset }: BoardProps): JSX.Element {
  const { offset, size } = useCanvasContext();

  return (
    <Group
      draggable
      onDragMove={(event) => {
        setOffset({ x: event.target.attrs.x, y: event.target.attrs.y });
      }}
    >
      <Rect
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

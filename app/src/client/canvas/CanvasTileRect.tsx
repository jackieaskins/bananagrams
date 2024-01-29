import { Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { CanvasName } from "./constants";

type CanvasTileRectProps = {
  fill: string;
  listening?: boolean;
  name?: CanvasName;
  opacity?: number;
  stroke: string;
  x?: number;
  y?: number;
};

export default function CanvasTileRect({
  fill,
  listening,
  name,
  opacity,
  stroke,
  x,
  y,
}: CanvasTileRectProps): JSX.Element {
  const { tileSize } = useCanvasContext();

  return (
    <Rect
      fill={fill}
      listening={listening}
      name={name}
      opacity={opacity}
      stroke={stroke}
      x={x}
      y={y}
      width={tileSize}
      height={tileSize}
      cornerRadius={tileSize * 0.15}
      strokeWidth={tileSize < 20 ? 1 : 2}
    />
  );
}

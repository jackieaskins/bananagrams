import { Line } from "react-konva";
import { useLineColorHex } from "@/client/utils/colors";

type GridLineProps = {
  points: number[];
};

export default function CanvasGridLine({ points }: GridLineProps): JSX.Element {
  const gridColor = useLineColorHex();

  return (
    <Line
      points={points}
      strokeWidth={1}
      stroke={gridColor}
      listening={false}
    />
  );
}

import { Line } from "react-konva";
import { useColorModeHex } from "./useColorHex";

type GridLineProps = {
  points: number[];
};

export default function CanvasGridLine({ points }: GridLineProps): JSX.Element {
  const gridColor = useColorModeHex("gray.400", "gray.700");

  return (
    <Line
      points={points}
      strokeWidth={1}
      stroke={gridColor}
      listening={false}
    />
  );
}

import { useToken } from "@chakra-ui/react";
import { Line } from "react-konva";

type GridLineProps = {
  points: number[];
};

export default function CanvasGridLine({ points }: GridLineProps): JSX.Element {
  const [gridColor] = useToken("colors", ["gray.700"]);

  return (
    <Line
      points={points}
      strokeWidth={1}
      stroke={gridColor}
      listening={false}
    />
  );
}

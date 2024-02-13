import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { useActiveBoardSquare } from "@/client/boards/ActiveBoardSquareContext";
import { useColorHex } from "@/client/utils/useColorHex";

const STROKE_WIDTH = 4;

export default function CanvasActiveBoardSquare(): JSX.Element | null {
  const { tileSize } = useCanvasContext();
  const { activeBoardSquare } = useActiveBoardSquare();
  const [strokeColor] = useColorHex(["cyan.400"]);

  if (!activeBoardSquare) return null;

  return (
    <Group listening={false} x={activeBoardSquare.x} y={activeBoardSquare.y}>
      <Rect
        width={tileSize}
        height={tileSize}
        strokeWidth={STROKE_WIDTH}
        stroke={strokeColor}
      />
    </Group>
  );
}

import { Group, Rect, Text } from "react-konva";
import { TILE_SIZE } from "./CanvasGrid";
import { setCursorWrapper } from "./setCursor";
import { useColorHex } from "./useColorHex";

export type TileProps = {
  letter: string;
  x: number;
  y: number;
};

export default function CanvasTile({ letter, x, y }: TileProps): JSX.Element {
  const [tileBg] = useColorHex(["yellow.100"]);

  return (
    <Group x={x} y={y} onMouseEnter={setCursorWrapper("grab")}>
      <Rect
        width={TILE_SIZE}
        height={TILE_SIZE}
        fill={tileBg}
        cornerRadius={5}
        stroke="black"
      />

      <Text
        text={letter}
        width={TILE_SIZE}
        height={TILE_SIZE + 1}
        fill="black"
        verticalAlign="middle"
        align="center"
        fontSize={TILE_SIZE / 2}
        fontStyle="bold"
      />
    </Group>
  );
}

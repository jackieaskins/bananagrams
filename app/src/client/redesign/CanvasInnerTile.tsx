import { Rect, Text } from "react-konva";
import { TILE_SIZE } from "./constants";
import { useColorHex } from "./useColorHex";
import { Tile } from "@/types/tile";

type CanvasInnerTileProps = {
  name?: string;
  color?: string;
  tile: Tile;
};

export default function CanvasInnerTile({
  color = "black",
  name,
  tile: { letter },
}: CanvasInnerTileProps): JSX.Element {
  const [tileBg] = useColorHex(["yellow.100"]);

  return (
    <>
      <Rect
        name={name}
        width={TILE_SIZE}
        height={TILE_SIZE}
        fill={tileBg}
        cornerRadius={5}
        stroke={color}
      />

      <Text
        text={letter}
        width={TILE_SIZE}
        height={TILE_SIZE + 1}
        fill={color}
        verticalAlign="middle"
        align="center"
        fontSize={TILE_SIZE / 2}
        fontStyle="bold"
        listening={false}
      />
    </>
  );
}

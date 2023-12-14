import { Rect, Text } from "react-konva";
import { Tile } from "../../types/tile";
import { TILE_SIZE } from "./CanvasGrid";
import { useColorHex } from "./useColorHex";

type CanvasInnerTileProps = {
  color?: string;
  tile: Tile;
};

export default function CanvasInnerTile({
  color = "black",
  tile: { letter },
}: CanvasInnerTileProps): JSX.Element {
  const [tileBg] = useColorHex(["yellow.100"]);

  return (
    <>
      <Rect
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
      />
    </>
  );
}

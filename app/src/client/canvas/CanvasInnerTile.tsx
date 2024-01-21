import { Rect, Text } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { useColorHex } from "@/client/utils/useColorHex";
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
  const { tileSize } = useCanvasContext();
  const [tileBg] = useColorHex(["yellow.100"]);

  return (
    <>
      <Rect
        name={name}
        width={tileSize}
        height={tileSize}
        fill={tileBg}
        cornerRadius={tileSize * 0.15}
        stroke={color}
        strokeWidth={tileSize < 20 ? 1 : 2}
      />

      <Text
        text={letter}
        width={tileSize}
        height={tileSize + 1}
        fill={color}
        verticalAlign="middle"
        align="center"
        fontSize={tileSize / 2}
        fontStyle="bold"
        listening={false}
      />
    </>
  );
}

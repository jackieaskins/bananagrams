import { Text } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasTileRect from "./CanvasTileRect";
import { CanvasName } from "./constants";
import { useColorHex } from "@/client/utils/useColorHex";
import { Tile } from "@/types/tile";

type CanvasInnerTileProps = {
  name?: CanvasName;
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
      <CanvasTileRect name={name} fill={tileBg} stroke={color} />

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

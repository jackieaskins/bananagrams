import { KonvaEventObject } from "konva/lib/Node";
import { Group } from "react-konva";
import { Tile } from "../../types/tile";
import CanvasInnerTile from "./CanvasInnerTile";
import { useSelectedTile } from "./SelectedTileContext";
import { setCursor } from "./setCursor";

export type TileProps = {
  name: string;
  color?: string;
  tile: Tile;
  x: number;
  y: number;
  onPointerClick: (event: KonvaEventObject<MouseEvent>) => void;
};

export default function CanvasTile({
  name,
  color,
  tile,
  x,
  y,
  onPointerClick,
}: TileProps): JSX.Element {
  const { selectedTile } = useSelectedTile();

  return (
    <Group
      x={x}
      y={y}
      onPointerClick={onPointerClick}
      onPointerEnter={(evt) => {
        if (!selectedTile) {
          setCursor(evt, "grab");
        }
      }}
      opacity={selectedTile?.tile.id === tile.id ? 0.6 : 1}
    >
      <CanvasInnerTile name={name} color={color} tile={tile} />
    </Group>
  );
}

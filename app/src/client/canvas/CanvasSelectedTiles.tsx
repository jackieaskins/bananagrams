import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasInnerTile from "./CanvasInnerTile";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

export default function CanvasSelectedTiles(): JSX.Element | null {
  const { tileSize } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();

  if (!selectedTiles) {
    return null;
  }

  const { tiles, followPosition } = selectedTiles;

  return (
    <Group
      x={followPosition.x - tileSize / 2}
      y={followPosition.y - tileSize / 2}
    >
      {tiles.map(({ tile, followOffset }) => (
        <Group
          key={tile.id}
          x={followOffset.x * tileSize}
          y={followOffset.y * tileSize}
        >
          <CanvasInnerTile tile={tile} />
        </Group>
      ))}
    </Group>
  );
}

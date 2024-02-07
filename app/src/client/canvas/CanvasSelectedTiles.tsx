import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasInnerTile from "./CanvasInnerTile";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

export default function CanvasSelectedTiles(): JSX.Element | null {
  const { cursorPosition, tileSize } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();

  if (!selectedTiles) {
    return null;
  }

  const { tiles } = selectedTiles;

  return (
    <Group
      x={cursorPosition.x - tileSize / 2}
      y={cursorPosition.y - tileSize / 2}
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

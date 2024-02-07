import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasInnerTile from "./CanvasInnerTile";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import getRotatedLocation from "@/client/tiles/getRotatedLocation";

export default function CanvasSelectedTiles(): JSX.Element | null {
  const { cursorPosition, tileSize } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();

  if (!selectedTiles) {
    return null;
  }

  const { rotation, tiles } = selectedTiles;

  return (
    <Group
      x={cursorPosition.x - tileSize / 2}
      y={cursorPosition.y - tileSize / 2}
    >
      {tiles.map(({ tile, relativeLocation }) => {
        const rotatedLocation = getRotatedLocation(rotation, relativeLocation);
        return (
          <Group
            key={tile.id}
            x={rotatedLocation.x * tileSize}
            y={rotatedLocation.y * tileSize}
          >
            <CanvasInnerTile tile={tile} />
          </Group>
        );
      })}
    </Group>
  );
}

import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Group } from "react-konva";
import { BoardLocation } from "../../types/board";
import { Tile } from "../../types/tile";
import CanvasInnerTile from "./CanvasInnerTile";
import { useSelectedTile } from "./SelectedTileContext";
import { setCursor } from "./setCursor";

const delta = 5;

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
  const [startPos, setStartPos] = useState<BoardLocation | null>(null);
  const [canRelease, setCanRelease] = useState(true);

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      setStartPos({ x: e.evt.x, y: e.evt.y });
      setCanRelease(false);
      onPointerClick(e);
    },
    [onPointerClick],
  );

  return (
    <Group
      x={x}
      y={y}
      onPointerDown={handlePointerClick}
      onPointerMove={(e) => {
        if (
          startPos &&
          (Math.abs(e.evt.x - startPos.x) > delta ||
            Math.abs(e.evt.y - startPos.y) > delta)
        ) {
          setCanRelease(true);
          setStartPos(null);
        }
      }}
      onPointerUp={(e) => {
        if (canRelease) {
          handlePointerClick(e);
        }
      }}
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

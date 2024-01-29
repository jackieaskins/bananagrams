import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import CanvasInnerTile from "./CanvasInnerTile";
import { CanvasName } from "./constants";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { setCursor } from "@/client/utils/setCursor";
import { BoardLocation } from "@/types/board";
import { Tile } from "@/types/tile";

const delta = 5;

export type TileProps = {
  name: CanvasName;
  color?: string;
  tile: Tile;
  x: number;
  y: number;
  onPointerClick: (event: KonvaEventObject<PointerEvent>) => void;
  onPointerEnter?: (event: KonvaEventObject<PointerEvent>) => void;
};

export default function CanvasTile({
  name,
  color,
  tile,
  x,
  y,
  onPointerClick,
  onPointerEnter,
}: TileProps): JSX.Element {
  const { playable } = useCanvasContext();
  const { selectedTiles } = useSelectedTiles();
  const [startPos, setStartPos] = useState<BoardLocation | null>(null);
  const [canRelease, setCanRelease] = useState(true);

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      setStartPos({ x: e.evt.x, y: e.evt.y });
      setCanRelease(false);
      onPointerClick(e);
    },
    [onPointerClick],
  );

  const isTileSelected = useMemo(
    () =>
      new Set(selectedTiles?.tiles.map(({ tile: { id } }) => id)).has(tile.id),
    [selectedTiles?.tiles, tile.id],
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
        if (selectedTiles && canRelease) {
          handlePointerClick(e);
        }
      }}
      onPointerEnter={(e) => {
        if (!selectedTiles) {
          setCursor(e, "grab");
        }
        onPointerEnter?.(e);
      }}
      opacity={isTileSelected ? 0.6 : 1}
      listening={playable}
    >
      <CanvasInnerTile name={name} color={color} tile={tile} />
    </Group>
  );
}

import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback, useState } from "react";
import { Group } from "react-konva";
import { BoardLocation } from "../boards/types";
import { Tile } from "../tiles/types";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasInnerTile from "./CanvasInnerTile";
import { setCursor, setCursorWrapper } from "./setCursor";

export type TileProps = {
  color?: string;
  tile: Tile;
  x: number;
  y: number;
  tileRef: React.RefObject<Konva.Group>;
  onDragEnd: (pointerPosition: Vector2d, boardPosition: BoardLocation) => void;
};

export default function CanvasTile({
  color,
  tile,
  x,
  y,
  tileRef,
  onDragEnd,
}: TileProps): JSX.Element {
  const { stageRef, offset } = useCanvasContext();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnd = useCallback(
    (evt: KonvaEventObject<DragEvent>) => {
      setCursor(evt, "grab");
      setIsDragging(false);
      const pointerPosition = stageRef.current?.getPointerPosition();

      if (!pointerPosition) {
        return;
      }

      onDragEnd(pointerPosition, {
        x: Math.floor((pointerPosition.x - offset.x) / TILE_SIZE),
        y: Math.floor((pointerPosition.y - offset.y) / TILE_SIZE),
      });
    },
    [offset.x, offset.y, onDragEnd, stageRef],
  );

  return (
    <>
      <Group x={x} y={y} opacity={0.6} visible={isDragging}>
        <CanvasInnerTile color={color} tile={tile} />
      </Group>

      <Group
        x={x}
        y={y}
        ref={tileRef}
        onClick={() => {
          tileRef.current?.startDrag();
        }}
        onMouseEnter={setCursorWrapper("grab")}
        onMouseDown={setCursorWrapper("grabbing")}
        onDragStart={() => {
          setIsDragging(true);
          tileRef.current?.moveToTop();
        }}
        onDragEnd={handleDragEnd}
        draggable
      >
        <CanvasInnerTile color={color} tile={tile} />
      </Group>
    </>
  );
}

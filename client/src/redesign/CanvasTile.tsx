import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback } from "react";
import { Group, Rect, Text } from "react-konva";
import { BoardLocation } from "../boards/types";
import { Tile } from "../tiles/types";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import { setCursor, setCursorWrapper } from "./setCursor";
import { useColorHex } from "./useColorHex";

export type TileProps = {
  color?: string;
  tile: Tile;
  x: number;
  y: number;
  tileRef: React.RefObject<Konva.Group>;
  onDragEnd: (pointerPosition: Vector2d, boardPosition: BoardLocation) => void;
};

export default function CanvasTile({
  color = "black",
  tile: { letter },
  x,
  y,
  tileRef,
  onDragEnd,
}: TileProps): JSX.Element {
  const { stageRef, offset } = useCanvasContext();
  const [tileBg] = useColorHex(["yellow.100"]);

  const handleDragEnd = useCallback(
    (evt: KonvaEventObject<DragEvent>) => {
      setCursor(evt, "grab");
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
    <Group
      x={x}
      y={y}
      ref={tileRef}
      onClick={(evt) => {
        tileRef.current?.startDrag(evt);
      }}
      onMouseEnter={setCursorWrapper("grab")}
      onMouseDown={setCursorWrapper("grabbing")}
      onDragStart={() => {
        tileRef.current?.moveToTop();
      }}
      onDragEnd={handleDragEnd}
      draggable
    >
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
    </Group>
  );
}

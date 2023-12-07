import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback, useState } from "react";
import { Group } from "react-konva";
import { Portal } from "react-konva-utils";
import { BoardLocation } from "../boards/types";
import { Tile } from "../tiles/types";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasInnerTile from "./CanvasInnerTile";
import { setCursor, setCursorWrapper } from "./setCursor";

export type TileProps = {
  color?: string;
  dragLayer: string;
  tile: Tile;
  x: number;
  y: number;
  tileRef: React.RefObject<Konva.Group>;
  onDragEnd: (pointerPosition: Vector2d, boardPosition: BoardLocation) => void;
  onHandHover?: (isOverHand: boolean) => void;
};

export default function CanvasTile({
  color,
  dragLayer,
  tile,
  x,
  y,
  tileRef,
  onDragEnd,
  onHandHover,
}: TileProps): JSX.Element {
  const {
    boardRectRef,
    handRectRef,
    offset,
    setHoveredBoardPosition,
    stageRef,
  } = useCanvasContext();
  const [isDragging, setDragging] = useState(false);

  const handleDragMove = useCallback(() => {
    const pointerPosition = stageRef.current?.getPointerPosition();

    const overHand =
      !!pointerPosition && !!handRectRef.current?.intersects(pointerPosition);
    onHandHover?.(overHand);

    if (overHand) {
      setHoveredBoardPosition(null);
    } else {
      setHoveredBoardPosition(
        boardRectRef.current?.getParent()?.getRelativePointerPosition() ?? null,
      );
    }
  }, [
    boardRectRef,
    handRectRef,
    onHandHover,
    setHoveredBoardPosition,
    stageRef,
  ]);

  const handleDragEnd = useCallback(
    (evt: KonvaEventObject<DragEvent>) => {
      setCursor(evt, "grab");
      setDragging(false);
      const pointerPosition = stageRef.current?.getPointerPosition();

      if (!pointerPosition) {
        return;
      }

      onDragEnd(pointerPosition, {
        x: Math.floor((pointerPosition.x - offset.x) / TILE_SIZE),
        y: Math.floor((pointerPosition.y - offset.y) / TILE_SIZE),
      });

      onHandHover?.(false);
      setHoveredBoardPosition(null);
    },
    [
      offset.x,
      offset.y,
      onDragEnd,
      onHandHover,
      setHoveredBoardPosition,
      stageRef,
    ],
  );

  return (
    <Portal selector={`.${dragLayer}`} enabled={isDragging}>
      {isDragging && (
        <Group x={x} y={y} opacity={0.6}>
          <CanvasInnerTile color={color} tile={tile} />
        </Group>
      )}

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
          setDragging(true);
        }}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        draggable
      >
        <CanvasInnerTile color={color} tile={tile} />
      </Group>
    </Portal>
  );
}

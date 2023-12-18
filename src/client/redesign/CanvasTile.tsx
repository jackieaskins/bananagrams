import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo, useState } from "react";
import { Group } from "react-konva";
import { Portal } from "react-konva-utils";
import { BoardLocation } from "../../types/board";
import { Tile } from "../../types/tile";
import { useGame } from "../games/GameContext";
import { useCanvasContext } from "./CanvasContext";
import CanvasInnerTile from "./CanvasInnerTile";
import { DRAG_LEAVE_EVENT, DRAG_OVER_EVENT, TILE_SIZE } from "./constants";
import { setCursor, setCursorWrapper } from "./setCursor";

const EXCHANGE_COUNT = 3;

export type TileProps = {
  color?: string;
  dragLayer: string;
  tile: Tile;
  x: number;
  y: number;
  tileRef: React.RefObject<Konva.Group>;
  fireHandDragEvents: boolean;
  onDump: () => void;
  onHandMove: () => void;
  onBoardMove: (boardLocation: BoardLocation) => void;
};

export default function CanvasTile({
  color,
  dragLayer,
  fireHandDragEvents,
  tile,
  x,
  y,
  tileRef,
  onDump,
  onHandMove,
  onBoardMove,
}: TileProps): JSX.Element {
  const {
    boardRectRef,
    handRectRef,
    dumpZoneRectRef,
    offset,
    setHoveredBoardPosition,
    stageRef,
  } = useCanvasContext();
  const [isDragging, setDragging] = useState(false);
  const {
    gameInfo: { bunch },
  } = useGame();

  const canDump = useMemo(() => bunch.length > EXCHANGE_COUNT, [bunch.length]);

  const handleDragMove = useCallback(() => {
    const pointerPosition = stageRef.current?.getPointerPosition();

    const overDumpZone =
      !!pointerPosition &&
      !!dumpZoneRectRef.current?.intersects(pointerPosition);
    const overHand =
      !!pointerPosition && !!handRectRef.current?.intersects(pointerPosition);

    if (fireHandDragEvents) {
      handRectRef.current?.fire(overHand ? DRAG_OVER_EVENT : DRAG_LEAVE_EVENT);
    }

    dumpZoneRectRef.current?.fire(
      canDump && overDumpZone ? DRAG_OVER_EVENT : DRAG_LEAVE_EVENT,
    );

    if (overHand || overDumpZone) {
      setHoveredBoardPosition(null);
    } else {
      setHoveredBoardPosition(
        boardRectRef.current?.getParent()?.getRelativePointerPosition() ?? null,
      );
    }
  }, [
    boardRectRef,
    canDump,
    dumpZoneRectRef,
    fireHandDragEvents,
    handRectRef,
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

      if (dumpZoneRectRef.current?.intersects(pointerPosition)) {
        if (canDump) {
          onDump();
        } else {
          tileRef.current?.position({ x, y });
        }
      } else if (handRectRef.current?.intersects(pointerPosition)) {
        onHandMove();
      } else {
        onBoardMove({
          x: Math.floor((pointerPosition.x - offset.x) / TILE_SIZE),
          y: Math.floor((pointerPosition.y - offset.y) / TILE_SIZE),
        });
      }

      dumpZoneRectRef.current?.fire(DRAG_LEAVE_EVENT);
      handRectRef.current?.fire(DRAG_LEAVE_EVENT);
      setHoveredBoardPosition(null);
    },
    [
      canDump,
      dumpZoneRectRef,
      handRectRef,
      offset.x,
      offset.y,
      onBoardMove,
      onDump,
      onHandMove,
      setHoveredBoardPosition,
      stageRef,
      tileRef,
      x,
      y,
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

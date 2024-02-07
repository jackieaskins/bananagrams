import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback, useMemo, useRef } from "react";
import { Group, Rect } from "react-konva";
import { useCanvasContext } from "./CanvasContext";
import { CanvasName } from "./constants";
import { parseBoardKey } from "@/client/boards/key";
import { useKeys } from "@/client/keys/KeysContext";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { useColorModeHex } from "@/client/utils/useColorHex";

export type Selection = { start: Vector2d; end: Vector2d };
type CanvasSelectRectProps = {
  setSelection: SetState<Selection | null>;
  selection: Selection | null;
};

export default function CanvasSelectRect({
  setSelection,
  selection,
}: CanvasSelectRectProps): JSX.Element {
  const selectRef = useRef<Konva.Rect>(null);
  const { board } = useCurrentPlayer();
  const { offset, size, tileSize } = useCanvasContext();
  const { selectTiles } = useSelectedTiles();
  const { shiftDown } = useKeys();
  const color = useColorModeHex("gray.300", "gray.500");

  const rectDimensions = useMemo(() => {
    if (!selection) return null;
    const { start, end } = selection;

    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(start.x - end.x),
      height: Math.abs(start.y - end.y),
    };
  }, [selection]);

  const handlePointerDown = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (shiftDown) {
        setSelection({
          start: { x: e.evt.x, y: e.evt.y },
          end: { x: e.evt.x, y: e.evt.y },
        });
      }
    },
    [setSelection, shiftDown],
  );

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      setSelection((selection) => {
        if (!selection) return null;

        return {
          ...selection,
          end: { x: e.evt.x, y: e.evt.y },
        };
      });
    },
    [setSelection],
  );

  const handlePointerUp = useCallback(() => {
    if (rectDimensions) {
      const { rectX, rectY, rectWidth, rectHeight } = {
        rectX: (rectDimensions.x - offset.x) / tileSize,
        rectY: (rectDimensions.y - offset.y) / tileSize,
        rectWidth: rectDimensions.width / tileSize,
        rectHeight: rectDimensions.height / tileSize,
      };

      const tiles = Object.entries(board)
        .map(([boardKey, { tile }]) => ({
          boardLocation: parseBoardKey(boardKey),
          tile,
        }))
        .filter(
          ({ boardLocation: { x, y } }) =>
            rectX + rectWidth >= x &&
            rectX <= x + 1 &&
            rectY + rectHeight >= y &&
            rectY <= y + 1,
        );

      selectTiles(tiles);
    }

    setSelection(null);
  }, [
    board,
    offset.x,
    offset.y,
    rectDimensions,
    selectTiles,
    setSelection,
    tileSize,
  ]);

  return (
    <Group visible={shiftDown || !!selection}>
      <Rect
        x={0}
        y={0}
        name={CanvasName.SelectRect}
        width={size.width}
        height={size.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      <Rect
        listening={false}
        ref={selectRef}
        visible={!!rectDimensions}
        fill={color}
        opacity={0.7}
        x={rectDimensions?.x}
        y={rectDimensions?.y}
        width={rectDimensions?.width}
        height={rectDimensions?.height}
      />
    </Group>
  );
}

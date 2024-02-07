import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";
import CanvasBoard from "./CanvasBoard";
import { Offset, useCanvasContext } from "./CanvasContext";
import CanvasHandWrapper from "./CanvasHandWrapper";
import CanvasSelectRect, { Selection } from "./CanvasSelectRect";
import CanvasSelectedTiles from "./CanvasSelectedTiles";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import useSetCursor from "@/client/utils/useSetCursor";

type CanvasProps = {
  setCursorPosition: SetState<Vector2d>;
  setOffset: SetState<Offset>;
};

export default function Canvas({
  setCursorPosition,
  setOffset,
}: CanvasProps): JSX.Element {
  const { board } = useCurrentPlayer();
  const { size, stageRef } = useCanvasContext();
  const [selection, setSelection] = useState<Selection | null>(null);

  useSetCursor(selection);

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      setCursorPosition({ x: e.evt.x, y: e.evt.y });
    },
    [setCursorPosition],
  );

  return (
    <Stage
      width={size.width}
      height={size.height}
      ref={stageRef}
      onPointerMove={handlePointerMove}
    >
      <Layer>
        <CanvasBoard setOffset={setOffset} board={board} />
        <CanvasSelectRect selection={selection} setSelection={setSelection} />
        <CanvasHandWrapper listening={!selection} />
      </Layer>

      <Layer listening={false}>
        <CanvasSelectedTiles />
      </Layer>
    </Stage>
  );
}

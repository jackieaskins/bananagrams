import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHandWrapper from "./CanvasHandWrapper";
import CanvasSelectRect, { Selection } from "./CanvasSelectRect";
import CanvasSelectedTiles from "./CanvasSelectedTiles";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { board } = useCurrentPlayer();
  const { size, stageRef } = useCanvasContext();
  const [selection, setSelection] = useState<Selection | null>(null);
  const { updateFollowPosition } = useSelectedTiles();

  const handlePointerMove = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      updateFollowPosition(e);
    },
    [updateFollowPosition],
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

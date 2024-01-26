import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHandWrapper from "./CanvasHandWrapper";
import CanvasSelectedTiles from "./CanvasSelectedTiles";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import {
  SelectedTiles,
  SelectedTilesContext,
} from "@/client/tiles/SelectedTilesContext";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { board } = useCurrentPlayer();
  const { size, stageRef } = useCanvasContext();
  const [selectedTiles, setSelectedTiles] = useState<SelectedTiles | null>(
    null,
  );

  const handlePointerMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    setSelectedTiles((selectedTiles) => {
      if (selectedTiles) {
        return {
          ...selectedTiles,
          followPosition: { x: e.evt.x, y: e.evt.y },
        };
      }

      return null;
    });
  }, []);

  return (
    <SelectedTilesContext.Provider value={{ selectedTiles, setSelectedTiles }}>
      <Stage
        width={size.width}
        height={size.height}
        ref={stageRef}
        onPointerMove={handlePointerMove}
      >
        <Layer>
          <CanvasBoard setOffset={setOffset} board={board} />
          <CanvasHandWrapper />
        </Layer>

        <Layer listening={false}>
          <CanvasSelectedTiles />
        </Layer>
      </Stage>
    </SelectedTilesContext.Provider>
  );
}

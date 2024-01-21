import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Group, Layer, Stage } from "react-konva";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHandWrapper from "./CanvasHandWrapper";
import CanvasInnerTile from "./CanvasInnerTile";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";
import { SetState } from "@/client/state/types";
import {
  SelectedTile,
  SelectedTileContext,
} from "@/client/tiles/SelectedTileContext";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { board } = useCurrentPlayer();
  const { size, stageRef, tileSize } = useCanvasContext();
  const [selectedTile, setSelectedTile] = useState<SelectedTile | null>(null);

  const handlePointerMove = useCallback((e: KonvaEventObject<MouseEvent>) => {
    setSelectedTile((selectedTile) => {
      if (selectedTile) {
        return {
          ...selectedTile,
          followPosition: { x: e.evt.x, y: e.evt.y },
        };
      }

      return null;
    });
  }, []);

  return (
    <SelectedTileContext.Provider value={{ selectedTile, setSelectedTile }}>
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

        <Layer>
          {selectedTile && (
            <Group
              listening={false}
              x={selectedTile.followPosition.x - tileSize / 2}
              y={selectedTile.followPosition.y - tileSize / 2}
            >
              <CanvasInnerTile tile={selectedTile.tile} />
            </Group>
          )}
        </Layer>
      </Stage>
    </SelectedTileContext.Provider>
  );
}

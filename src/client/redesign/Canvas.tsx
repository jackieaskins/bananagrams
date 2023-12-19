import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useState } from "react";
import { Group, Layer, Stage } from "react-konva";
import { SetState } from "../state/types";
import CanvasBoard from "./CanvasBoard";
import { useCanvasContext } from "./CanvasContext";
import CanvasHand from "./CanvasHand";
import CanvasInnerTile from "./CanvasInnerTile";
import { SelectedTile, SelectedTileContext } from "./SelectedTileContext";

type CanvasProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function Canvas({ setOffset }: CanvasProps): JSX.Element {
  const { size, stageRef } = useCanvasContext();
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
          <CanvasBoard setOffset={setOffset} />
          <CanvasHand />
        </Layer>

        <Layer>
          {selectedTile && (
            <Group
              listening={false}
              x={selectedTile.followPosition.x + 5}
              y={selectedTile.followPosition.y + 5}
            >
              <CanvasInnerTile tile={selectedTile.tile} />
            </Group>
          )}
        </Layer>
      </Stage>
    </SelectedTileContext.Provider>
  );
}

import { Group, Rect } from "react-konva";
import { parseBoardKey } from "../boards/key";
import { SetState } from "../state/types";
import CanvasBoardDragOverlay from "./CanvasBoardDragOverlay";
import CanvasBoardTile from "./CanvasBoardTile";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import CanvasOffScreenIndicators from "./CanvasOffScreenIndicators";
import { setCursorWrapper } from "./setCursor";
import { useCurrentPlayer } from "./useCurrentPlayer";

type BoardProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function CanvasBoard({ setOffset }: BoardProps): JSX.Element {
  const { boardRectRef, offset, size } = useCanvasContext();
  const { board } = useCurrentPlayer();

  return (
    <Group
      draggable
      onDragMove={(event) => {
        setOffset({ x: event.target.attrs.x, y: event.target.attrs.y });
      }}
    >
      <Rect
        ref={boardRectRef}
        x={-offset.x}
        y={-offset.y}
        width={size.width}
        height={size.height}
        onMouseEnter={setCursorWrapper("move")}
      />

      <CanvasGrid width={size.width} height={size.height} />

      {Object.entries(board).map(([boardKey, boardSquare]) => {
        const { x, y } = parseBoardKey(boardKey);
        return (
          <CanvasBoardTile
            key={`${boardSquare.tile.id}-${boardKey}`}
            boardSquare={boardSquare}
            x={x}
            y={y}
          />
        );
      })}

      <CanvasBoardDragOverlay />
      <CanvasOffScreenIndicators />
    </Group>
  );
}

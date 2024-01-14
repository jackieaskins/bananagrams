import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import { Group, Rect } from "react-konva";
import CanvasBoardDragOverlay from "./CanvasBoardDragOverlay";
import CanvasBoardTile from "./CanvasBoardTile";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import CanvasOffScreenIndicators from "./CanvasOffScreenIndicators";
import { useSelectedTile } from "./SelectedTileContext";
import { Attrs, CanvasName } from "./constants";
import { setCursor } from "./setCursor";
import { parseBoardKey } from "@/client/boards/key";
import { useGame } from "@/client/games/GameContext";
import { SetState } from "@/client/state/types";
import { Board } from "@/types/board";

type BoardProps = {
  board: Board;
  setOffset: SetState<{ x: number; y: number }>;
};

export default function CanvasBoard({
  board,
  setOffset,
}: BoardProps): JSX.Element {
  const { offset, size, playable, tileSize } = useCanvasContext();
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileOnBoard, handleMoveTileFromHandToBoard } = useGame();

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!playable || !selectedTile) return;

      const toLocation = {
        x: Math.floor((e.evt.x - offset.x) / tileSize),
        y: Math.floor((e.evt.y - offset.y) / tileSize),
      };

      if (selectedTile.location) {
        handleMoveTileOnBoard(selectedTile.location, toLocation);
      } else {
        handleMoveTileFromHandToBoard(selectedTile.tile.id, toLocation);
      }

      setSelectedTile(null);
      setCursor(e, "grab");
    },
    [
      handleMoveTileFromHandToBoard,
      handleMoveTileOnBoard,
      offset.x,
      offset.y,
      playable,
      selectedTile,
      setSelectedTile,
      tileSize,
    ],
  );

  return (
    <Group
      draggable={!selectedTile}
      onDragMove={(event) => {
        const { x, y } = event.target.attrs as Attrs;
        setOffset({ x, y });
      }}
    >
      <Rect
        name={CanvasName.Board}
        x={-offset.x}
        y={-offset.y}
        width={size.width}
        height={size.height}
        onPointerEnter={(evt) => {
          if (!selectedTile) setCursor(evt, "move");
        }}
        onPointerUp={handlePointerClick}
      />

      <CanvasGrid width={size.width} height={size.height} />

      {Object.entries(board).map(([boardKey, boardSquare]) => {
        const { x, y } = parseBoardKey(boardKey);

        return (
          <CanvasBoardTile
            key={boardSquare.tile.id}
            boardSquare={boardSquare}
            x={x}
            y={y}
          />
        );
      })}

      {playable && <CanvasBoardDragOverlay />}
      <CanvasOffScreenIndicators board={board} />
    </Group>
  );
}

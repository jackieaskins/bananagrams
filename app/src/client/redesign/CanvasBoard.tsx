import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import { Group, Rect } from "react-konva";
import CanvasBoardDragOverlay from "./CanvasBoardDragOverlay";
import CanvasBoardTile from "./CanvasBoardTile";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import CanvasOffScreenIndicators from "./CanvasOffScreenIndicators";
import { useSelectedTile } from "./SelectedTileContext";
import { Attrs, CanvasName, TILE_SIZE } from "./constants";
import { setCursor } from "./setCursor";
import { useCurrentPlayer } from "./useCurrentPlayer";
import { parseBoardKey } from "@/client/boards/key";
import { useGame } from "@/client/games/GameContext";
import { SetState } from "@/client/state/types";

type BoardProps = {
  setOffset: SetState<{ x: number; y: number }>;
};

export default function CanvasBoard({ setOffset }: BoardProps): JSX.Element {
  const { offset, size } = useCanvasContext();
  const { board } = useCurrentPlayer();
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileOnBoard, handleMoveTileFromHandToBoard } = useGame();

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!selectedTile) return;

      const toLocation = {
        x: Math.floor((e.evt.x - offset.x) / TILE_SIZE),
        y: Math.floor((e.evt.y - offset.y) / TILE_SIZE),
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
      selectedTile,
      setSelectedTile,
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

      <CanvasBoardDragOverlay />
      <CanvasOffScreenIndicators />
    </Group>
  );
}

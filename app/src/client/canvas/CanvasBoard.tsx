import { KonvaEventObject } from "konva/lib/Node";
import { useCallback } from "react";
import { Group, Rect } from "react-konva";
import CanvasBoardDragOverlay from "./CanvasBoardDragOverlay";
import CanvasBoardTile from "./CanvasBoardTile";
import { useCanvasContext } from "./CanvasContext";
import CanvasGrid from "./CanvasGrid";
import CanvasOffScreenIndicators from "./CanvasOffScreenIndicators";
import { Attrs, CanvasName } from "./constants";
import { parseBoardKey } from "@/client/boards/key";
import { vectorSum } from "@/client/boards/vectorMath";
import { useGame } from "@/client/games/GameContext";
import { useKeys } from "@/client/keys/KeysContext";
import { SetState } from "@/client/state/types";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
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
  const { clearSelectedTiles, selectedTiles } = useSelectedTiles();
  const { handleMoveTilesOnBoard, handleMoveTilesFromHandToBoard } = useGame();
  const { shiftDown } = useKeys();

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<PointerEvent>) => {
      if (!playable || !selectedTiles) return;

      const toLocation = {
        x: Math.floor((e.evt.x - offset.x) / tileSize),
        y: Math.floor((e.evt.y - offset.y) / tileSize),
      };

      const { tiles, boardLocation } = selectedTiles;

      if (boardLocation) {
        handleMoveTilesOnBoard(
          tiles.map(({ relativePosition, followOffset }) => ({
            fromLocation: vectorSum(boardLocation, relativePosition),
            toLocation: vectorSum(toLocation, followOffset),
          })),
        );
      } else {
        handleMoveTilesFromHandToBoard(
          tiles.map(({ followOffset, tile }) => ({
            tileId: tile.id,
            boardLocation: vectorSum(toLocation, followOffset),
          })),
        );
      }

      clearSelectedTiles();
    },
    [
      clearSelectedTiles,
      handleMoveTilesFromHandToBoard,
      handleMoveTilesOnBoard,
      offset,
      playable,
      selectedTiles,
      tileSize,
    ],
  );

  return (
    <Group
      draggable={!playable || (!shiftDown && !selectedTiles)}
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

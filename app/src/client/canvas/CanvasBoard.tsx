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
import { useGame } from "@/client/games/GameContext";
import { SetState } from "@/client/state/types";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { setCursor } from "@/client/utils/setCursor";
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
  const { selectedTiles, setSelectedTiles } = useSelectedTiles();
  const { handleMoveTilesOnBoard, handleMoveTilesFromHandToBoard } = useGame();

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!playable || !selectedTiles) return;

      const toLocation = {
        x: Math.floor((e.evt.x - offset.x) / tileSize),
        y: Math.floor((e.evt.y - offset.y) / tileSize),
      };

      const { tiles } = selectedTiles;

      // Making an assumption that all selected tiles will either be in hand or board, but never a mix of both
      if (tiles[0].location) {
        handleMoveTilesOnBoard(
          tiles.map(({ followOffset, location }) => ({
            fromLocation: location!,
            toLocation: {
              x: toLocation.x + followOffset.x,
              y: toLocation.y + followOffset.y,
            },
          })),
        );
      } else {
        handleMoveTilesFromHandToBoard(
          tiles.map(({ followOffset, tile }) => ({
            tileId: tile.id,
            boardLocation: {
              x: toLocation.x + followOffset.x,
              y: toLocation.y + followOffset.y,
            },
          })),
        );
      }

      setSelectedTiles(null);
      setCursor(e, "grab");
    },
    [
      handleMoveTilesFromHandToBoard,
      handleMoveTilesOnBoard,
      offset.x,
      offset.y,
      playable,
      selectedTiles,
      setSelectedTiles,
      tileSize,
    ],
  );

  return (
    <Group
      draggable={!selectedTiles}
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
          if (!selectedTiles) setCursor(evt, "move");
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

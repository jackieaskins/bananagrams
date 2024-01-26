import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo } from "react";
import { useCanvasContext } from "./CanvasContext";
import CanvasTile from "./CanvasTile";
import { CanvasName } from "./constants";
import { useGame } from "@/client/games/GameContext";
import { useSelectedTiles } from "@/client/tiles/SelectedTilesContext";
import { setCursor } from "@/client/utils/setCursor";
import { useColorHex } from "@/client/utils/useColorHex";
import {
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "@/types/board";

type CanvasBoardTileProps = {
  boardSquare: BoardSquare;
  x: number;
  y: number;
};

type CheckValidation = (wordInfo: WordInfo) => boolean;
function getColor(wordInfo: Record<Direction, WordInfo>): string {
  const isValid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.VALID;
  const isValidated: CheckValidation = ({ validation }) =>
    validation !== ValidationStatus.NOT_VALIDATED;

  const validations = Object.values(wordInfo).filter(isValidated);

  if (validations.length === 0) return "black";
  if (validations.every(isValid)) return "green.600";
  return "red.600";
}

export default function CanvasBoardTile({
  boardSquare: { tile, wordInfo },
  x,
  y,
}: CanvasBoardTileProps): JSX.Element {
  const { tileSize } = useCanvasContext();
  const { selectedTiles, setSelectedTiles } = useSelectedTiles();
  const { handleMoveTilesOnBoard, handleMoveTilesFromHandToBoard } = useGame();
  const chakraColor = useMemo(() => getColor(wordInfo), [wordInfo]);
  const [color] = useColorHex([chakraColor]);

  const handlePointerClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      /*
       * No selected tile:
       * - Select the tile under the cursor at current location
       * - Set the cursor to grabbing
       *
       * Current tile is selected:
       * - Deselect tile
       * - Set the cursor to grab
       *
       * Current tile is also on the board:
       * - Call moveTilesOnBoard
       * - ~~Select the tile under the cursor at its new position~~ Deselect tile
       * - Set the cursor to ~~grabbing~~ grab
       *
       * Current tile is in the hand:
       * - Call moveTilesFromHandToBoard
       * - ~~Select the tile under the cursor with no position~~ Deselect tile
       * - Set the cursor to ~~grabbing~~ grab
       */

      if (!selectedTiles) {
        setSelectedTiles({
          tiles: [{ tile, location: { x, y }, followOffset: { x: 0, y: 0 } }],
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      const { tiles } = selectedTiles;

      // Making an assumption that all selected tiles will either be in hand or board, but never a mix of both
      if (tiles[0].location) {
        handleMoveTilesOnBoard(
          tiles.map(({ followOffset, location }) => ({
            fromLocation: location!,
            toLocation: {
              x: x + followOffset.x,
              y: y + followOffset.y,
            },
          })),
        );
      } else {
        handleMoveTilesFromHandToBoard(
          tiles.map(({ followOffset, tile }) => ({
            tileId: tile.id,
            boardLocation: {
              x: x + followOffset.x,
              y: y + followOffset.y,
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
      selectedTiles,
      setSelectedTiles,
      tile,
      x,
      y,
    ],
  );

  return (
    <CanvasTile
      name={CanvasName.BoardTile}
      tile={tile}
      x={x * tileSize}
      y={y * tileSize}
      color={color}
      onPointerClick={handlePointerClick}
    />
  );
}

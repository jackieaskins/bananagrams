import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useMemo } from "react";
import {
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "../../types/board";
import { useGame } from "../games/GameContext";
import CanvasTile from "./CanvasTile";
import { useSelectedTile } from "./SelectedTileContext";
import { CanvasName, TILE_SIZE } from "./constants";
import { setCursor } from "./setCursor";
import { useColorHex } from "./useColorHex";

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
  const { selectedTile, setSelectedTile } = useSelectedTile();
  const { handleMoveTileOnBoard, handleMoveTileFromHandToBoard } = useGame();
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
       * - Call moveTileOnBoard
       * - Select the tile under the cursor at its new position
       * - Set the cursor to grabbing
       *
       * Current tile is in the hand:
       * - Call moveTileFromHandToBoard
       * - Select the tile under the cursor with no position
       * - Set the cursor to grabbing
       */

      if (!selectedTile) {
        setSelectedTile({
          tile,
          location: { x, y },
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      if (selectedTile.tile.id === tile.id) {
        setSelectedTile(null);
        setCursor(e, "grab");
        return;
      }

      if (selectedTile.location) {
        handleMoveTileOnBoard(selectedTile.location, { x, y });
        setSelectedTile({
          tile,
          location: selectedTile.location,
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      handleMoveTileFromHandToBoard(selectedTile.tile.id, { x, y });
      setSelectedTile({
        tile,
        location: null,
        followPosition: { x: e.evt.x, y: e.evt.y },
      });
      setCursor(e, "grabbing");
    },
    [
      handleMoveTileFromHandToBoard,
      handleMoveTileOnBoard,
      selectedTile,
      setSelectedTile,
      tile,
      x,
      y,
    ],
  );

  return (
    <CanvasTile
      name={CanvasName.BoardTile}
      tile={tile}
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      color={color}
      onPointerClick={handlePointerClick}
    />
  );
}

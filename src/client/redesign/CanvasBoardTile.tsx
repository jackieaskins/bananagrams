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

  const handleClick = useCallback(
    (e: KonvaEventObject<MouseEvent>) => {
      if (!selectedTile) {
        setSelectedTile({
          tile,
          location: { x, y },
          followPosition: { x: e.evt.x, y: e.evt.y },
        });
        setCursor(e, "grabbing");
        return;
      }

      if (selectedTile?.location) {
        handleMoveTileOnBoard(selectedTile.location, { x, y });
      } else if (selectedTile) {
        handleMoveTileFromHandToBoard(selectedTile.tile.id, { x, y });
      }

      setSelectedTile({
        tile,
        location: selectedTile?.location ?? null,
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
      onClick={handleClick}
    />
  );
}

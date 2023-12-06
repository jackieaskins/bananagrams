import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useCallback, useMemo, useRef } from "react";
import {
  BoardLocation,
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "../boards/types";
import { useGame } from "../games/GameContext";
import { BOARD_TILE_DRAG_LAYER } from "./Canvas";
import { useCanvasContext } from "./CanvasContext";
import { TILE_SIZE } from "./CanvasGrid";
import CanvasTile from "./CanvasTile";
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
  const tileRef = useRef<Konva.Group>(null);
  const { handRectRef, offset } = useCanvasContext();
  const { handleMoveTileFromBoardToHand, handleMoveTileOnBoard } = useGame();

  const chakraColor = useMemo(() => getColor(wordInfo), [wordInfo]);
  const [color] = useColorHex([chakraColor]);

  const handleDragEnd = useCallback(
    (pointerPosition: Vector2d, boardPosition: BoardLocation) => {
      const fromLocation = {
        x: (x - offset.x) / TILE_SIZE,
        y: (y - offset.y) / TILE_SIZE,
      };

      if (handRectRef.current?.intersects(pointerPosition)) {
        handleMoveTileFromBoardToHand(fromLocation);
      } else {
        if (
          fromLocation.x === boardPosition.x &&
          fromLocation.y === boardPosition.y
        ) {
          tileRef.current?.position({ x, y });
        } else {
          handleMoveTileOnBoard(fromLocation, boardPosition);
        }
      }
    },
    [
      handRectRef,
      handleMoveTileFromBoardToHand,
      handleMoveTileOnBoard,
      offset.x,
      offset.y,
      x,
      y,
    ],
  );

  return (
    <CanvasTile
      dragLayer={BOARD_TILE_DRAG_LAYER}
      tile={tile}
      x={x}
      y={y}
      tileRef={tileRef}
      onDragEnd={handleDragEnd}
      color={color}
    />
  );
}

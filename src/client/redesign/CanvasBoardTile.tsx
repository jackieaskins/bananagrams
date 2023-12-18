import Konva from "konva";
import { useCallback, useMemo, useRef } from "react";
import {
  BoardLocation,
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "../../types/board";
import { ClientToServerEventName } from "../../types/socket";
import { useGame } from "../games/GameContext";
import { socket } from "../socket";
import CanvasTile from "./CanvasTile";
import { BOARD_TILE_DRAG_LAYER, TILE_SIZE } from "./constants";
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
  const { handleMoveTileFromBoardToHand, handleMoveTileOnBoard } = useGame();

  const chakraColor = useMemo(() => getColor(wordInfo), [wordInfo]);
  const [color] = useColorHex([chakraColor]);

  const handleDump = useCallback(() => {
    socket.emit(ClientToServerEventName.Dump, {
      tileId: tile.id,
      boardLocation: { x, y },
    });
  }, [tile.id, x, y]);

  const handleHandMove = useCallback(() => {
    handleMoveTileFromBoardToHand({ x, y });
  }, [handleMoveTileFromBoardToHand, x, y]);

  const handleBoardMove = useCallback(
    (toLocation: BoardLocation) => {
      if (x === toLocation.x && y === toLocation.y) {
        tileRef.current?.position({ x: x * TILE_SIZE, y: y * TILE_SIZE });
      } else {
        handleMoveTileOnBoard({ x, y }, toLocation);
      }
    },
    [handleMoveTileOnBoard, x, y],
  );

  return (
    <CanvasTile
      dragLayer={BOARD_TILE_DRAG_LAYER}
      tile={tile}
      x={x * TILE_SIZE}
      y={y * TILE_SIZE}
      fireHandDragEvents
      tileRef={tileRef}
      color={color}
      onDump={handleDump}
      onHandMove={handleHandMove}
      onBoardMove={handleBoardMove}
    />
  );
}

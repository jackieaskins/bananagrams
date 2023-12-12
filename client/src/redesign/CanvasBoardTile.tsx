import Konva from "konva";
import { useCallback, useMemo, useRef } from "react";
import {
  BoardLocation,
  BoardSquare,
  Direction,
  ValidationStatus,
  WordInfo,
} from "../boards/types";
import { useGame } from "../games/GameContext";
import { useSocket } from "../socket/SocketContext";
import { BOARD_TILE_DRAG_LAYER } from "./Canvas";
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
  const { socket } = useSocket();
  const { handleMoveTileFromBoardToHand, handleMoveTileOnBoard } = useGame();

  const chakraColor = useMemo(() => getColor(wordInfo), [wordInfo]);
  const [color] = useColorHex([chakraColor]);

  const handleDump = useCallback(() => {
    socket.emit("dump", { tileId: tile.id, boardLocation: { x, y } });
  }, [socket, tile.id, x, y]);

  const handleHandMove = useCallback(() => {
    handleMoveTileFromBoardToHand({ x, y });
  }, [handleMoveTileFromBoardToHand, x, y]);

  const handleBoardMove = useCallback(
    (toLocation: BoardLocation) => {
      if (x === toLocation.x && y === toLocation.y) {
        tileRef.current?.position({ x, y });
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

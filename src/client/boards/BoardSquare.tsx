import { Box } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import { useEnableTileSwap } from "../LocalStorageContext";
import { useGame } from "../games/GameContext";
import Tile from "../tiles/Tile";
import { TileItem } from "../tiles/types";
import {
  BoardSquare as BoardSquareType,
  Direction,
  ValidationStatus,
  WordInfo,
} from "./types";

type BoardSquareProps = {
  boardSquare: BoardSquareType | null;
  x: number;
  y: number;
};

type CheckValidation = (wordInfo: WordInfo) => boolean;

function getColor(wordInfo: Record<Direction, WordInfo>): string | undefined {
  const isValid: CheckValidation = ({ validation }) =>
    validation === ValidationStatus.VALID;
  const isValidated: CheckValidation = ({ validation }) =>
    validation !== ValidationStatus.NOT_VALIDATED;

  const validations = Object.values(wordInfo).filter(isValidated);

  if (validations.length === 0) return "black";
  if (validations.every(isValid)) return "green.500";
  return "red.600";
}

export default function BoardSquare({
  boardSquare,
  x,
  y,
}: BoardSquareProps): JSX.Element {
  const [enableTileSwap] = useEnableTileSwap();
  const { handleMoveTileFromHandToBoard, handleMoveTileOnBoard } = useGame();
  const { tile, wordInfo } = boardSquare ?? {};

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "TILE",
    canDrop: (_, monitor) => monitor.isOver() && (enableTileSwap || !tile),
    drop: ({ id, boardLocation }: TileItem) => {
      if (boardLocation) {
        handleMoveTileOnBoard(boardLocation, { x, y });
      } else {
        handleMoveTileFromHandToBoard(id, { x, y });
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      backgroundColor={isOver && canDrop ? "green.400" : undefined}
      color={isOver && canDrop ? "green.400" : undefined}
      opacity={isOver && canDrop ? 0.5 : 1}
      height="25px"
      width="25px"
      ref={dropRef}
    >
      {tile && wordInfo ? (
        <Tile tile={tile} color={getColor(wordInfo)} boardLocation={{ x, y }} />
      ) : (
        ""
      )}
    </Box>
  );
}

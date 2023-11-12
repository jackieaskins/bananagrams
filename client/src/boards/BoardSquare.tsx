import { Box } from "@mui/material";
import { useDrop } from "react-dnd";
import { useGame } from "../games/GameContext";
import { validDropSx } from "../styles";
import Tile from "../tiles/Tile";
import { TileItem } from "../tiles/types";
import { BoardSquare, Direction, ValidationStatus, WordInfo } from "./types";

type BoardSquareProps = {
  boardSquare: BoardSquare | null;
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
  if (validations.every(isValid)) return "green";
  return "red";
}

export default function BoardSquare({
  boardSquare,
  x,
  y,
}: BoardSquareProps): JSX.Element {
  const { handleMoveTileFromHandToBoard, handleMoveTileOnBoard } = useGame();
  const { tile, wordInfo } = boardSquare ?? {};

  const [{ canDrop, isOver }, dropRef] = useDrop({
    accept: "TILE",
    canDrop: (_, monitor) => monitor.isOver() && !tile,
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
      sx={isOver && canDrop ? validDropSx : null}
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

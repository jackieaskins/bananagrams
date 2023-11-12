import { Box } from "@mui/material";
import { Board as BoardType } from "../boards/types";
import TransparentPaper from "../paper/TransparentPaper";
import BoardSquare from "./BoardSquare";

type BoardProps = {
  board: BoardType;
};

export default function Board({ board }: BoardProps): JSX.Element {
  return (
    <TransparentPaper
      component={Box}
      // @ts-expect-error These are accepted since the component is a Box
      display="inline-flex"
      flexDirection="column"
    >
      {board.map((row, x) => (
        <Box key={x} display="flex">
          {row.map((boardSquare, y) => (
            <BoardSquare key={y} x={x} y={y} boardSquare={boardSquare} />
          ))}
        </Box>
      ))}
    </TransparentPaper>
  );
}

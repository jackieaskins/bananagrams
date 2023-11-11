/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from "@mui/material";

import BoardSquare from "./BoardSquare";
import { Board as BoardType } from "../boards/types";
import TransparentPaper from "../paper/TransparentPaper";

type BoardProps = {
  board: BoardType;
};

const Board: React.FC<BoardProps> = ({ board }) => (
  <TransparentPaper
    component={Box}
    // @ts-ignore
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

export default Board;

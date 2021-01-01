/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';

import { Board as BoardType } from '../boards/types';
import TransparentPaper from '../paper/TransparentPaper';
import BoardSquare from './BoardSquare';

type BoardProps = {
  board: BoardType;
};

const Board = ({ board }: BoardProps): JSX.Element => (
  <TransparentPaper
    component={Box}
    // @ts-ignore
    display="inline-flex"
    flexDirection="column"
  >
    {board.map((rowSquares, row) => (
      <Box key={row} display="flex">
        {rowSquares.map((boardSquare, col) => (
          <BoardSquare
            key={col}
            row={row}
            col={col}
            boardSquare={boardSquare}
          />
        ))}
      </Box>
    ))}
  </TransparentPaper>
);

export default Board;

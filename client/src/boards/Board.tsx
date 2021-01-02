/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';

import { Board as BoardType, getSquareId } from '../boards/types';
import { DEFAULT_BOARD_LENGTH } from '../hands/Hand';
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
    {[...Array(DEFAULT_BOARD_LENGTH)].map((_, row) => (
      <Box key={row} display="flex">
        {[...Array(DEFAULT_BOARD_LENGTH)].map((_, col) => (
          <BoardSquare
            key={col}
            row={row}
            col={col}
            boardSquare={board[getSquareId({ row, col })] ?? null}
          />
        ))}
      </Box>
    ))}
  </TransparentPaper>
);

export default Board;

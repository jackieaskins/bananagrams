import React from 'react';
import Box from '@material-ui/core/Box';

import BoardSquare from './BoardSquare';
import { Board as BoardType } from '../boards/types';

type BoardProps = {
  board: BoardType;
};

const Board: React.FC<BoardProps> = ({ board }) => (
  <Box display="inline-flex" flexDirection="column" border={1}>
    {board.map((row, x) => (
      <Box key={x} display="flex">
        {row.map((tile, y) => (
          <BoardSquare key={y} x={x} y={y} tile={tile} />
        ))}
      </Box>
    ))}
  </Box>
);

export default Board;

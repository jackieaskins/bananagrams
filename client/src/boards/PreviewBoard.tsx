import React from 'react';
import { Box, Typography } from '@material-ui/core';

import { Board } from './types';
import TransparentPaper from '../paper/TransparentPaper';

type BoardProps = {
  board: Board;
};

const PreviewBoard: React.FC<BoardProps> = ({ board }) => (
  <TransparentPaper
    component={Box}
    variant="outlined"
    // @ts-ignore
    display="inline-flex"
    flexDirection="column"
  >
    {board.map((row, x) => (
      <Box key={x} display="flex">
        {row.map((tile, y) => {
          if (tile === null) {
            return <Box height="20px" width="20px" />;
          }

          return (
            <Box
              display="inline-flex"
              justifyContent="center"
              alignItems="center"
              key={y}
              style={{ backgroundColor: '#ffffc7' }}
              border={1}
              borderRadius="borderRadius"
              height="18px"
              width="18px"
            >
              <Typography variant="body2">{tile?.letter ?? ''}</Typography>
            </Box>
          );
        })}
      </Box>
    ))}
  </TransparentPaper>
);

export default PreviewBoard;

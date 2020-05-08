import React from 'react';
import { Box } from '@material-ui/core';

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
            <img
              key={y}
              src={`/assets/images/${tile.letter}.png`}
              alt={`Tile for the letter ${tile.letter}`}
              width="20px"
              height="20px"
            />
          );
        })}
      </Box>
    ))}
  </TransparentPaper>
);

export default PreviewBoard;

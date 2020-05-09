import React from 'react';
import { Box } from '@material-ui/core';

import { Board } from './types';
import TransparentPaper from '../paper/TransparentPaper';

type BoardProps = {
  board: Board;
  tileSize: number;
};

const PreviewBoard: React.FC<BoardProps> = ({ board, tileSize }) => {
  const tilePixels = `${tileSize}px`;

  return (
    <TransparentPaper
      component={Box}
      // @ts-ignore
      display="inline-flex"
      flexDirection="column"
    >
      {board.map((row, x) => (
        <Box key={x} display="flex">
          {row.map((tile, y) => {
            if (tile === null) {
              return <Box height={tilePixels} width={tilePixels} />;
            }

            return (
              <img
                key={y}
                src={`/assets/images/${tile.letter}.png`}
                alt={`Tile for the letter ${tile.letter}`}
                width={tilePixels}
                height={tilePixels}
              />
            );
          })}
        </Box>
      ))}
    </TransparentPaper>
  );
};

export default PreviewBoard;

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';

import TransparentPaper from '../paper/TransparentPaper';
import { Board } from './types';

type PreviewBoardProps = {
  board: Board;
  tileSize: number;
};

const PreviewBoard = ({ board, tileSize }: PreviewBoardProps): JSX.Element => {
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
          {row.map((boardSquare, y) => {
            const tile = boardSquare?.tile ?? null;

            if (tile === null) {
              return <Box key={y} height={tilePixels} width={tilePixels} />;
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

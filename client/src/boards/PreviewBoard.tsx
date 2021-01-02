/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Box } from '@material-ui/core';

import { DEFAULT_BOARD_LENGTH } from '../hands/Hand';
import TransparentPaper from '../paper/TransparentPaper';
import { Board, getSquareId } from './types';

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
      {[...Array(DEFAULT_BOARD_LENGTH)].map((_, row) => (
        <Box key={row} display="flex">
          {[...Array(DEFAULT_BOARD_LENGTH)].map((_, col) => {
            const tile = board[getSquareId({ row, col })]?.tile ?? null;

            if (tile === null) {
              return <Box key={col} height={tilePixels} width={tilePixels} />;
            }

            return (
              <img
                key={col}
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

import { useMemo } from 'react';
import Draggable from 'react-draggable';

import BoardSquare from './BoardSquare';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BORDER_STYLE,
  TILES_PER_COL,
  TILES_PER_ROW,
} from './constants';

const Board = (): JSX.Element => {
  const boardSquares = useMemo(
    () =>
      [...Array(TILES_PER_COL)].map((_, row) => (
        <div key={row} css={{ display: 'flex' }}>
          {[...Array(TILES_PER_ROW)].map((_, col) => (
            <BoardSquare key={col} row={row} col={col} />
          ))}
        </div>
      )),
    []
  );

  return (
    <Draggable bounds="parent" cancel=".no-drag">
      <div
        css={{
          display: 'flex',
          flexDirection: 'column',
          width: `${BOARD_WIDTH}px`,
          height: `${BOARD_HEIGHT}px`,
          border: BORDER_STYLE,
        }}
      >
        {boardSquares}
      </div>
    </Draggable>
  );
};

export default Board;

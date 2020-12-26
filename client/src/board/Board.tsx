import Draggable from 'react-draggable';

import BoardSquare from './BoardSquare';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BORDER_STYLE,
  TILES_PER_COL,
  TILES_PER_ROW,
} from './constants';

const Board = (): JSX.Element => (
  <Draggable bounds="parent">
    <div
      css={{
        cursor: 'move',
        display: 'flex',
        flexDirection: 'column',
        width: `${BOARD_WIDTH}px`,
        height: `${BOARD_HEIGHT}px`,
        border: BORDER_STYLE,
      }}
    >
      {[...Array(TILES_PER_COL)].map((_, y) => (
        <div key={y} css={{ display: 'flex' }}>
          {[...Array(TILES_PER_ROW)].map((_, x) => (
            <BoardSquare key={x} />
          ))}
        </div>
      ))}
    </div>
  </Draggable>
);

export default Board;

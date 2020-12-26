import { useWindowSize } from '../util/window';
import Board from './Board';
import { BOARD_HEIGHT, BOARD_WIDTH } from './constants';

const BoardView = (): JSX.Element => {
  const { width: windowWidth, height: windowHeight } = useWindowSize();

  return (
    <div
      css={{
        position: 'fixed',
        left:
          BOARD_WIDTH > windowWidth
            ? windowWidth - BOARD_WIDTH - 5
            : (windowWidth - BOARD_WIDTH) / 2,
        right:
          BOARD_WIDTH > windowWidth
            ? windowWidth - BOARD_WIDTH - 5
            : (windowWidth - BOARD_WIDTH) / 2,
        top:
          BOARD_HEIGHT > windowHeight
            ? windowHeight - BOARD_HEIGHT - 5
            : (windowHeight - BOARD_HEIGHT) / 2,
        bottom:
          BOARD_HEIGHT > windowHeight
            ? windowHeight - BOARD_HEIGHT - 5
            : (windowHeight - BOARD_HEIGHT) / 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Board />
    </div>
  );
};

export default BoardView;

import { Suspense } from 'react';

import BoardWrapper from '../board/LazyBoardWrapper';
import LoadingContainer from '../loading/LoadingContainer';
import Overlay from '../overlay/Overlay';
import SelectedTile from '../tile/SelectedTile';

const Game = (): JSX.Element => (
  <div
    css={{
      width: '100vw',
      height: '100vh',
    }}
  >
    <Suspense fallback={<LoadingContainer size="large" />}>
      <BoardWrapper />
    </Suspense>
    <Overlay />
    <SelectedTile />
  </div>
);

export default Game;

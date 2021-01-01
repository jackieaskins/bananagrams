import { lazy, Suspense } from 'react';

import LoadingContainer from '../loading/LoadingContainer';
import Overlay from '../overlay/Overlay';

const BoardWrapper = lazy(() => import('../board/BoardWrapper'));

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
  </div>
);

export default Game;

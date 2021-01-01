import { lazy, Suspense } from 'react';
import Draggable from 'react-draggable';

import LoadingContainer from '../loading/LoadingContainer';
import Controls from './Controls';

const Hand = lazy(() => import('./Hand'));

const Overlay = (): JSX.Element => (
  <Draggable cancel=".no-drag">
    <div
      css={{
        position: 'absolute',
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        border: '1px solid rgb(173, 216, 230)',
        cursor: 'move',
        width: '70vw',
        bottom: 0,
        left: 0,
        right: 0,
        margin: '15px auto',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'space-around',
        padding: '15px',
        transition: 'width 0.5s, height 0.5s',
      }}
    >
      <Suspense fallback={<LoadingContainer />}>
        <Hand />
        <Controls />
      </Suspense>
    </div>
  </Draggable>
);

export default Overlay;

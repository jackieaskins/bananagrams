import { Suspense } from 'react';
import Draggable from 'react-draggable';
import { useRecoilCallback } from 'recoil';

import LoadingContainer from '../loading/LoadingContainer';
import { moveTile } from '../socket';
import { selectedTileState } from '../tile/selectedTileState';
import Controls from './Controls';
import Hand from './LazyHand';

const Overlay = (): JSX.Element => {
  const handleClick = useRecoilCallback(
    ({ set, snapshot }) => async ({ target }) => {
      if (target.className.split(' ').includes('tile')) {
        return;
      }

      const selectedTile = await snapshot.getPromise(selectedTileState);

      if (selectedTile) {
        const {
          tile: { id: tileId },
          boardPosition,
        } = selectedTile;
        moveTile({
          tileId,
          fromPosition: boardPosition,
          toPosition: null,
        });
        set(selectedTileState, null);
      }
    },
    []
  );

  return (
    <Draggable cancel=".no-drag">
      <div
        className="overlay"
        css={{
          position: 'absolute',
          backgroundColor: 'rgba(173, 216, 230, 0.5)',
          border: '1px solid rgb(173, 216, 230)',
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
        onClick={handleClick}
      >
        <Suspense fallback={<LoadingContainer />}>
          <Hand />
          <Controls />
        </Suspense>
      </div>
    </Draggable>
  );
};

export default Overlay;

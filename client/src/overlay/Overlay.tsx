import { Space } from 'antd';
import { memo } from 'react';
import Draggable from 'react-draggable';
import { useRecoilCallback } from 'recoil';

import { moveTile } from '../socket';
import { selectedTileState } from '../tile/selectedTileState';
import Controls from './Controls';
import Hand from './Hand';

const Overlay = (): JSX.Element => {
  const handleClick = useRecoilCallback(
    ({ set, snapshot }) => async ({ target }) => {
      if (target.className.split(' ').includes('no-drop')) {
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
        css={{
          backgroundColor: 'rgba(173, 216, 230, 0.5)',
          border: '1px solid rgb(173, 216, 230)',
          borderRadius: '10px',
          bottom: 0,
          left: 0,
          margin: '15px auto',
          padding: '15px',
          position: 'absolute',
          right: 0,
          transition: 'width 0.5s, height 0.5s',
          width: '70vw',
        }}
        onClick={handleClick}
      >
        <Space align="start" size="middle">
          <Controls />
          <Hand />
        </Space>
      </div>
    </Draggable>
  );
};

export default memo(Overlay);

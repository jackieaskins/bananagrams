import { Space } from 'antd';
import { memo } from 'react';
import { useRecoilCallback } from 'recoil';

import DraggableCard from '../card/DraggableCard';
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
    <DraggableCard
      cardCSS={{
        bottom: 0,
        left: 0,
        margin: '15px auto',
        padding: '15px',
        position: 'absolute',
        right: 0,
        maxWidth: '750px',
        width: '95vw',
      }}
      onClick={handleClick}
    >
      <Space align="start" size="middle">
        <Controls />
        <Hand />
      </Space>
    </DraggableCard>
  );
};

export default memo(Overlay);

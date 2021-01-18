import { Space } from 'antd';
import { memo, useCallback, useMemo, useState } from 'react';

import { useGamePlayers } from '../game/stateHooks';
import LeaveGameButton from './LeaveGameButton';
import OpponentPreviewCard from './OpponentPreviewCard';
import OpponentViewButton from './OpponentViewButton';

const Actions = (): JSX.Element => {
  const [opponentPreviewVisible, setOpponentPreviewVisible] = useState(false);
  const players = useGamePlayers();

  const hasOtherPlayers = useMemo(() => players.length > 1, [players]);

  const toggleOpponentPreview = useCallback(() => {
    setOpponentPreviewVisible((visible) => !visible);
  }, [setOpponentPreviewVisible]);

  return (
    <div
      css={{
        margin: '10px',
        position: 'fixed',
        right: 0,
        top: 0,
      }}
    >
      <Space align="start">
        {hasOtherPlayers && (
          <OpponentPreviewCard visible={opponentPreviewVisible} />
        )}

        <Space direction="vertical">
          {hasOtherPlayers && (
            <OpponentViewButton
              previewVisible={opponentPreviewVisible}
              onClick={toggleOpponentPreview}
            />
          )}

          <LeaveGameButton />
        </Space>
      </Space>
    </div>
  );
};

export default memo(Actions);

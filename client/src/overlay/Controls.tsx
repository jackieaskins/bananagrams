import { Space, Typography } from 'antd';
import { memo } from 'react';

import { useGameBunchCount } from '../game/stateHooks';
import DumpButton from './DumpButton';
import PeelButton from './PeelButton';
import ShuffleButton from './ShuffleButton';

const Controls = (): JSX.Element => {
  const bunchCount = useGameBunchCount();

  return (
    <Space direction="vertical">
      <Space>
        <PeelButton />
        <ShuffleButton />
      </Space>

      <DumpButton />

      <div css={{ textAlign: 'center' }}>
        <Typography.Text type="secondary">
          Remaining tiles:{' '}
          <Typography.Text strong type="secondary">
            {bunchCount}
          </Typography.Text>
        </Typography.Text>
      </div>
    </Space>
  );
};

export default memo(Controls);

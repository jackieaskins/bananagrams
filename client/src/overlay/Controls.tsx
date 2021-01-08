import { Space } from 'antd';

import DumpButton from './DumpButton';
import PeelButton from './PeelButton';
import ShuffleButton from './ShuffleButton';

const Controls = (): JSX.Element => (
  <Space direction="vertical">
    <Space>
      <PeelButton />
      <ShuffleButton />
    </Space>

    <DumpButton />
  </Space>
);

export default Controls;

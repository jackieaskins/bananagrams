import { CrownOutlined, KeyOutlined } from '@ant-design/icons';
import { Space } from 'antd';

import { Player } from '../players/types';

type NameCellProps = {
  player: Player;
};

const NameCell = ({
  player: { isAdmin, isTopBanana, username },
}: NameCellProps): JSX.Element => (
  <Space>
    <span>{username}</span>
    {isAdmin && (
      <span>
        <KeyOutlined />
      </span>
    )}
    {isTopBanana && (
      <span>
        <CrownOutlined />
      </span>
    )}
  </Space>
);

export default NameCell;

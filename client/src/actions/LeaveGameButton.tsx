import { ExportOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { memo } from 'react';
import { useHistory } from 'react-router-dom';

import ActionButton from './ActionButton';

const LeaveGameButton = (): JSX.Element => {
  const { push } = useHistory();

  return (
    <Tooltip placement="left" title="Leave game">
      <Popconfirm
        cancelText="No"
        okText="Yes"
        onConfirm={() => push('/')}
        placement="topLeft"
        title="Are you sure you want to leave the game?"
      >
        <ActionButton icon={<ExportOutlined />} />
      </Popconfirm>
    </Tooltip>
  );
};

export default memo(LeaveGameButton);

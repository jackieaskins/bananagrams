import { ExportOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';

import FloatingButton from '../button/FloatingButton';

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
        <FloatingButton icon={<ExportOutlined />} shape="circle" />
      </Popconfirm>
    </Tooltip>
  );
};

export default LeaveGameButton;

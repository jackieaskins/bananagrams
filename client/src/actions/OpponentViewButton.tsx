import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

import ActionButton from './ActionButton';

type OpponentViewButtonProps = {
  onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  previewVisible: boolean;
};

const OpponentViewButton = ({
  onClick,
  previewVisible,
}: OpponentViewButtonProps): JSX.Element => (
  <Tooltip
    placement="left"
    title={`${previewVisible ? 'Hide' : 'Show'} opponent boards`}
  >
    <ActionButton
      icon={previewVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
      onClick={onClick}
    />
  </Tooltip>
);

export default OpponentViewButton;

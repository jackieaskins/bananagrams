import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Checkbox } from 'antd';

import { getUserId, setReady } from '../socket';
import { Player } from './types';

type ReadyCellProps = {
  player: Player;
};

const ReadyCell = ({
  player: { userId, isReady },
}: ReadyCellProps): JSX.Element => {
  const isCurrentUser = userId === getUserId();

  if (isCurrentUser) {
    return (
      <Checkbox
        checked={isReady}
        onChange={({ target: { checked } }) => {
          setReady({ isReady: checked });
        }}
      />
    );
  }

  if (isReady) {
    return <CheckOutlined css={{ color: 'green' }} />;
  }

  return <CloseOutlined css={{ color: 'red' }} />;
};
export default ReadyCell;

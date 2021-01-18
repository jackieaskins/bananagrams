import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { useCurrentPlayer } from '../game/stateHooks';
import { kickPlayer } from '../socket';
import { Player } from './types';

type ActionsCellProps = {
  player: Player;
};

const ActionsCell = ({
  player: { userId },
}: ActionsCellProps): JSX.Element | null => {
  const currentPlayer = useCurrentPlayer();

  if (!currentPlayer) {
    return null;
  }

  const { isAdmin, userId: currentPlayerId } = currentPlayer;

  if (isAdmin && userId !== currentPlayerId) {
    return (
      <Button
        icon={<DeleteOutlined />}
        onClick={() => {
          kickPlayer({ userId });
        }}
        type="text"
      />
    );
  }

  return null;
};

export default ActionsCell;

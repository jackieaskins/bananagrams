import { Modal } from 'antd';

import { useGameCountdown, useGameStatus } from './stateHooks';

const CountdownModal = (): JSX.Element => {
  const gameStatus = useGameStatus();
  const countdown = useGameCountdown();

  return (
    <Modal
      footer={null}
      title="Game starting"
      visible={gameStatus === 'STARTING'}
    >
      Everyone is ready, the game will start in {countdown} seconds
    </Modal>
  );
};

export default CountdownModal;

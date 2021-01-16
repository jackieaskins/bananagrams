import { Modal } from 'antd';
import { useMemo } from 'react';

import { getUserId } from '../socket';
import { useGameCountdown, useGamePlayers, useGameStatus } from './stateHooks';

const CountdownModal = (): JSX.Element => {
  const userId = getUserId();
  const gameStatus = useGameStatus();
  const countdown = useGameCountdown();
  const players = useGamePlayers();

  const topBanana = useMemo(() => {
    const winner = players.find(({ isTopBanana }) => isTopBanana);

    if (!winner) {
      return 'Someone';
    }

    return userId === winner.userId ? 'You' : winner.username;
  }, [players, userId]);

  const modalTitle = useMemo(
    () => (gameStatus === 'STARTING' ? 'Game starting' : 'Game over'),
    [gameStatus]
  );

  const modalText = useMemo(() => {
    const countdownText = `${countdown} second${countdown === 1 ? '' : 's'}`;

    if (gameStatus === 'STARTING') {
      return `Everyone is ready, the game will start in ${countdownText}`;
    }

    return `${topBanana} won! The game will end in ${countdownText}`;
  }, [gameStatus, countdown, topBanana]);

  return (
    <Modal
      closable={false}
      footer={null}
      title={modalTitle}
      visible={['STARTING', 'ENDING'].includes(gameStatus)}
    >
      {modalText}
    </Modal>
  );
};

export default CountdownModal;

import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addGameInfoListener, removeGameInfoListener } from '../socket';
import WaitingRoom from './WaitingRoom';
import { useIsGameInProgress, useUpdateGameState } from './state';

type GameRouterProps = {
  initialGameInfo: GameInfo;
};

const GameRouter = ({ initialGameInfo }: GameRouterProps): JSX.Element => {
  const updateGameState = useUpdateGameState();
  const isGameInProgress = useIsGameInProgress();

  useEffect(() => {
    updateGameState(initialGameInfo);

    addGameInfoListener((info: GameInfo) => {
      updateGameState(info);
    });

    return (): void => {
      removeGameInfoListener();
    };
  }, [initialGameInfo, updateGameState]);

  if (isGameInProgress) {
    return <div>Game is in progress</div>;
  }

  return <WaitingRoom />;
};

export default GameRouter;

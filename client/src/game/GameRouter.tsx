import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addGameInfoListener, removeGameInfoListener } from '../socket';
import Game from './Game';
import WaitingRoom from './WaitingRoom';
import { useGameStatus, useUpdateGameState } from './stateHooks';

type GameRouterProps = {
  initialGameInfo: GameInfo;
};

const GameRouter = ({ initialGameInfo }: GameRouterProps): JSX.Element => {
  const updateGameState = useUpdateGameState();
  const gameStatus = useGameStatus();
  const isGameInProgress = gameStatus === 'IN_PROGRESS';

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
    return <Game />;
  }

  return <WaitingRoom />;
};

export default GameRouter;

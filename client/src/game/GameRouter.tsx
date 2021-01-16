import { message } from 'antd';
import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addListeners, removeListeners } from '../socket';
import Game from './Game';
import WaitingRoom from './WaitingRoom';
import {
  useGameStatus,
  useSetCurrentBoard,
  useSetCurrentHand,
  useUpdateGameState,
} from './stateHooks';

type GameRouterProps = {
  initialGameInfo: GameInfo;
};

const GameRouter = ({ initialGameInfo }: GameRouterProps): JSX.Element => {
  const updateGameState = useUpdateGameState();
  const gameStatus = useGameStatus();
  const setCurrentBoard = useSetCurrentBoard();
  const setCurrentHand = useSetCurrentHand();
  const isGameInProgress = ['IN_PROGRESS', 'ENDING'].includes(gameStatus);

  useEffect(() => {
    updateGameState(initialGameInfo);
    message.config({ maxCount: 3 });

    addListeners(
      (notification) => {
        message.info(notification);
      },
      (info) => {
        updateGameState(info);
      },
      (board) => {
        setCurrentBoard(board);
      },
      (hand) => {
        setCurrentHand(hand);
      }
    );

    return removeListeners;
  }, [initialGameInfo, updateGameState, setCurrentHand, setCurrentBoard]);

  if (isGameInProgress) {
    return <Game />;
  }

  return <WaitingRoom />;
};

export default GameRouter;

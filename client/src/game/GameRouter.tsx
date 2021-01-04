import { useEffect } from 'react';

import { GameInfo } from '../games/types';
import { addListeners, removeListeners } from '../socket';
import Game from './Game';
import WaitingRoom from './WaitingRoom';
import {
  useGameStatus,
  useSetCurrentBoardSquare,
  useSetCurrentHand,
  useUpdateGameState,
} from './stateHooks';

type GameRouterProps = {
  initialGameInfo: GameInfo;
};

const GameRouter = ({ initialGameInfo }: GameRouterProps): JSX.Element => {
  const updateGameState = useUpdateGameState();
  const gameStatus = useGameStatus();
  const setCurrentBoardSquare = useSetCurrentBoardSquare();
  const setCurrentHand = useSetCurrentHand();
  const isGameInProgress = gameStatus === 'IN_PROGRESS';

  useEffect(() => {
    updateGameState(initialGameInfo);

    addListeners(
      (info) => {
        updateGameState(info);
      },
      (boardSquare) => {
        setCurrentBoardSquare(boardSquare);
      },
      (hand) => {
        setCurrentHand(hand);
      }
    );

    return removeListeners;
  }, [initialGameInfo, updateGameState, setCurrentHand, setCurrentBoardSquare]);

  if (isGameInProgress) {
    return <Game />;
  }

  return <WaitingRoom />;
};

export default GameRouter;

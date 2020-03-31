import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useSocket, GameId } from '../SocketContext';

type GameState = {
  gameId: GameId;
};

export const useGame = (): GameState => {
  const { search } = useLocation();
  const { leaveGame } = useSocket();

  const { id: gameId } = Object.fromEntries(new URLSearchParams(search));

  useEffect(() => (): void => leaveGame({ gameId }), []);

  return {
    gameId,
  };
};

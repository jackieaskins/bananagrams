import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { GameInfo, GameLocationState, GameState } from './types';
import { useSocket } from '../SocketContext';

type GameParams = {
  gameId: string;
};

const getEmptyGameInfo = (gameId: string): GameInfo => ({
  gameId,
  gameName: '',
  isInProgress: false,
  bunch: [],
  players: [],
  previousSnapshot: null,
});

const GameContext = createContext<GameState>({
  gameInfo: getEmptyGameInfo(''),
  isInGame: false,
});

export const GameProvider: React.FC = ({ children }) => {
  const { socket } = useSocket();
  const { replace } = useHistory();
  const { pathname, state } = useLocation<GameLocationState>();
  const { gameId } = useParams<GameParams>();

  const [gameInfo, setGameInfo] = useState<GameInfo>(
    state?.gameInfo ?? getEmptyGameInfo(gameId)
  );
  const [isInGame] = useState<boolean>(state?.isInGame ?? false);

  useEffect(() => {
    if (isInGame) {
      replace(pathname);

      return (): void => {
        socket.emit('leaveGame', { gameId });
      };
    }

    return;
  }, []);

  useEffect(() => {
    socket.on('gameInfo', (gameInfo: GameInfo) => {
      setGameInfo(gameInfo);
    });

    return (): void => {
      socket.off('gameInfo');
    };
  }, []);

  return (
    <GameContext.Provider value={{ gameInfo, isInGame }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameState => useContext(GameContext);

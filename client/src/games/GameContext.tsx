import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { useSocket } from '../SocketContext';

type GameParams = {
  gameId: string;
};

export type Player = {
  userId: string;
  username: string;
  isOwner: boolean;
  isReady: boolean;
  hand: Record<string, Tile>;
  board: (Tile | null)[][];
};

export type GameInfo = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  bunchSize: number;
  players: Player[];
};

export type GameLocationState = {
  isInGame?: boolean;
  gameInfo?: GameInfo;
};

export type Tile = {
  id: string;
  letter: string;
};

type GameState = {
  gameInfo: GameInfo;
  isInGame: boolean;
};

const getEmptyGameInfo = (gameId: string): GameInfo => ({
  gameId,
  gameName: '',
  isInProgress: false,
  bunchSize: 0,
  players: [],
});

const GameContext = createContext<GameState>({
  gameInfo: getEmptyGameInfo(''),
  isInGame: false,
});

export const GameProvider: React.FC<{}> = ({ children }) => {
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
      console.log(gameInfo);
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

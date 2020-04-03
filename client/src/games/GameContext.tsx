import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import { useSocket } from '../SocketContext';
import { SetState } from '../state/types';

type GameParams = {
  gameId: string;
};

export type GameLocationState = {
  isInGame?: boolean;
  gameInfo?: GameInfo;
};

export type Player = {
  userId: string;
  username: string;
  isOwner: boolean;
  isReady: boolean;
};

export type GameInfo = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  players: Player[];
};

type Tile = {
  id: string;
  letter: string;
};

type GameState = {
  bunchSize: number;
  gameId: string;
  gameName: string;
  hand: Record<string, any>;
  isInGame: boolean;
  isInProgress: boolean;
  setIsInProgress: SetState<boolean>;
  setPlayers: SetState<Player[]>;
  setPlayerReady: (userId: string, isReady: boolean) => void;
  players: Player[];
};

const GameContext = createContext<GameState>({
  bunchSize: 0,
  gameId: '',
  gameName: '',
  hand: {},
  isInGame: false,
  isInProgress: false,
  setIsInProgress: () => undefined,
  setPlayerReady: () => undefined,
  setPlayers: () => undefined,
  players: [],
});

export const GameProvider: React.FC<{}> = ({ children }) => {
  const { socket } = useSocket();
  const { replace } = useHistory();
  const { pathname, state } = useLocation<GameLocationState>();
  const { gameId } = useParams<GameParams>();

  const [gameName] = useState(state?.gameInfo?.gameName ?? '');
  const [isInProgress, setIsInProgress] = useState(
    state?.gameInfo?.isInProgress ?? false
  );
  const [isInGame] = useState(state?.isInGame ?? false);
  const [players, setPlayers] = useState(state?.gameInfo?.players ?? []);
  const [bunchSize, setBunchSize] = useState<number>(0);
  const [hand, setHand] = useState<Record<string, any>>({});

  const setPlayerReady = (userId: string, isReady: boolean): void => {
    setPlayers((prevPlayers) => {
      const index = prevPlayers.findIndex((player) => player.userId === userId);
      return [
        ...prevPlayers.slice(0, index),
        { ...prevPlayers[index], isReady },
        ...prevPlayers.slice(index + 1),
      ];
    });
  };

  useEffect(() => {
    if (isInGame) {
      replace(pathname);

      return (): void => {
        socket.emit('leaveGame', { gameId }, () => undefined);
      };
    }

    return;
  }, []);

  useEffect(() => {
    socket.on('playerJoined', (player: Player) => {
      setPlayers((prevPlayers) => [...prevPlayers, player]);
    });

    socket.on('playerLeft', ({ userId }: Player) =>
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.userId !== userId)
      )
    );

    socket.on('playerReady', ({ userId }: Player) => {
      setPlayerReady(userId, true);
    });

    socket.on(
      'gameReady',
      ({
        isInProgress,
        bunchSize,
        hand,
      }: {
        isInProgress: boolean;
        bunchSize: number;
        hand: Record<string, any>;
      }) => {
        setIsInProgress(isInProgress);
        setBunchSize(bunchSize);
        setHand(hand);
      }
    );

    return (): void => {
      socket.off('playerJoined');
      socket.off('playerLeft');
      socket.off('playerReady');
      socket.off('gameReady');
    };
  }, []);

  return (
    <GameContext.Provider
      value={{
        bunchSize,
        gameId,
        gameName,
        hand,
        isInGame,
        isInProgress,
        players,
        setIsInProgress,
        setPlayerReady,
        setPlayers,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameState => useContext(GameContext);

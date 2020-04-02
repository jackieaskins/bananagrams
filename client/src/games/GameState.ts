import { useEffect, useState } from 'react';
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
  isPlaying: boolean;
};

export type GameInfo = {
  gameId: string;
  gameName: string;
  isInProgress: boolean;
  players: Player[];
};

type GameState = {
  gameId: string;
  gameName: string;
  isInGame: boolean;
  isInProgress: boolean;
  setIsInProgress: SetState<boolean>;
  setPlayers: SetState<Player[]>;
  players: Player[];
};

export const useGame = (): GameState => {
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

    socket.on('playerLeft', ({ userId }: Player) => {
      console.log('player left');

      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player.userId !== userId)
      );
    });

    return (): void => {
      socket.off('playerJoined');
      socket.off('playerLeft');
    };
  }, []);

  return {
    gameId,
    gameName,
    isInGame,
    isInProgress,
    players,
    setIsInProgress,
    setPlayers,
  };
};

import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useSocket } from '../SocketContext';
import { GameInfo, GameLocationState } from './GameContext';
import { SetState } from '../state/types';

type JoinGameParams = {
  gameId: string;
};

type JoinGameFormState = {
  error: string;
  isJoiningGame: boolean;
  onSubmit: () => void;
  setUsername: SetState<string>;
  username: string;
};

export const useJoinGameForm = (): JoinGameFormState => {
  const { socket } = useSocket();
  const { push } = useHistory();
  const { gameId } = useParams<JoinGameParams>();

  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const onSubmit = (): void => {
    setIsJoiningGame(true);

    socket.emit(
      'joinGame',
      { gameId, username },
      (error: Error, gameInfo: GameInfo) => {
        if (error) {
          setError(error.message);
          setIsJoiningGame(false);
        } else {
          const locationState: GameLocationState = {
            isInGame: true,
            gameInfo,
          };

          push(`/game/${gameId}`, locationState);
        }
      }
    );
  };

  return {
    error,
    isJoiningGame,
    onSubmit,
    setUsername,
    username,
  };
};

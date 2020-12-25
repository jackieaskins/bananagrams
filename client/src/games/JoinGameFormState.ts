import { useState, MouseEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useSocket } from '../socket/SocketContext';
import { SetState } from '../state/types';
import { GameInfo, GameLocationState } from './types';

type JoinGameParams = {
  gameId: string;
};

type JoinGameFormState = {
  error: string;
  isJoiningGame: boolean;
  onSubmit: (event: MouseEvent<HTMLElement>) => void;
  setUsername: SetState<string>;
  username: string;
};

export const useJoinGameForm = (): JoinGameFormState => {
  const { socket } = useSocket();
  const { push } = useHistory();
  const { gameId } = useParams<JoinGameParams>();

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const onSubmit = (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();

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

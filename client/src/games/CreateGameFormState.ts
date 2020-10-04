import { useState, MouseEvent } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useSocket } from '../socket/SocketContext';
import { SetState } from '../state/types';
import { GameInfo, GameLocationState } from './types';

export type CreateGameFormState = {
  error: string;
  gameName: string;
  isCreatingGame: boolean;
  onSubmit: (event: MouseEvent<HTMLElement>) => void;
  setGameName: SetState<string>;
  setUsername: SetState<string>;
  username: string;
};

export const useCreateGameForm = (): CreateGameFormState => {
  const [gameName, setGameName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const { push } = useHistory();
  const { search } = useLocation();
  const isShortenedGame = new URLSearchParams(search).has('isShortenedGame');

  const { socket } = useSocket();

  const onSubmit = (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();

    setIsCreatingGame(true);

    socket.emit(
      'createGame',
      { gameName, username, isShortenedGame },
      (error: Error, gameInfo: GameInfo) => {
        if (error) {
          setError(error.message);
          setIsCreatingGame(false);
        } else {
          const locationState: GameLocationState = {
            isInGame: true,
            gameInfo,
          };

          push(`/game/${gameInfo.gameId}`, locationState);
        }
      }
    );
  };

  return {
    error,
    gameName,
    isCreatingGame,
    onSubmit,
    setGameName,
    setUsername,
    username,
  };
};

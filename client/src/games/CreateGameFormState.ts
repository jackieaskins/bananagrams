import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useSocket } from '../SocketContext';
import { SetState } from '../state/types';
import { GameInfo, GameLocationState } from './GameState';

export type CreateGameFormState = {
  error: string;
  gameName: string;
  isCreatingGame: boolean;
  onSubmit: () => void;
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

  const { socket } = useSocket();

  const onSubmit = (): void => {
    setIsCreatingGame(true);

    socket.emit(
      'createGame',
      { gameName, username },
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

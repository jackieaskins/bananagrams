import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useSocket, GameName, Username } from '../SocketContext';

export type CreateGameFormState = {
  error: string;
  gameName: GameName;
  isCreatingGame: boolean;
  onSubmit: () => void;
  setGameName: (gameName: GameName) => void;
  setUsername: (username: Username) => void;
  username: Username;
};

export const useCreateGameForm = (): CreateGameFormState => {
  const [gameName, setGameName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const { push } = useHistory();

  const { createGame } = useSocket();

  const onSubmit = (): void => {
    setIsCreatingGame(true);

    createGame({ gameName, username }, (error, gameId) => {
      if (error) {
        setError(error.message);
        setIsCreatingGame(false);
      } else {
        push(`/game?id=${gameId}`);
      }
    });
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

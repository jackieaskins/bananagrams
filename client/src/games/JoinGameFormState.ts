import { useState } from 'react';

import { useSocket, GameId, Username } from '../SocketContext';

type JoinGameFormState = {
  error: string;
  isJoiningGame: boolean;
  onSubmit: () => void;
  setUsername: (username: Username) => void;
  username: Username;
};

export const useJoinGameForm = ({
  gameId,
}: {
  gameId: GameId;
}): JoinGameFormState => {
  const { currentUsername, joinGame } = useSocket();

  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const [error, setError] = useState('');

  const onSubmit = (): void => {
    setIsJoiningGame(true);
    joinGame({ gameId, username }, (error) => {
      if (error) {
        setError(error.message);
      }

      setIsJoiningGame(false);
    });
  };

  return {
    error,
    isJoiningGame,
    onSubmit,
    setUsername,
    username,
  };
};

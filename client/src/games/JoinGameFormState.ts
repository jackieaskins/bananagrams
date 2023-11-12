import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "../socket/SocketContext";
import { SetState } from "../state/types";
import { GameInfo, GameLocationState } from "./types";

type JoinGameParams = {
  gameId: string;
};

type JoinGameFormState = {
  error: string;
  isJoiningGame: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  setUsername: SetState<string>;
  username: string;
};

export function useJoinGameForm(): JoinGameFormState {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { gameId } = useParams<JoinGameParams>() as JoinGameParams;

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      setIsJoiningGame(true);

      socket.emit(
        "joinGame",
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

            navigate(`/game/${gameId}`, { state: locationState });
          }
        },
      );
    },
    [gameId, navigate, socket, username],
  );

  return {
    error,
    isJoiningGame,
    onSubmit,
    setUsername,
    username,
  };
}

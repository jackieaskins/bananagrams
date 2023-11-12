import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../socket/SocketContext";
import { SetState } from "../state/types";
import { GameInfo, GameLocationState } from "./types";

export type CreateGameFormState = {
  error: string;
  gameName: string;
  isCreatingGame: boolean;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  setGameName: SetState<string>;
  setUsername: SetState<string>;
  username: string;
};

export function useCreateGameForm(): CreateGameFormState {
  const [gameName, setGameName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const navigate = useNavigate();
  const { search } = useLocation();
  const isShortenedGame = new URLSearchParams(search).has("isShortenedGame");

  const { socket } = useSocket();

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      setIsCreatingGame(true);

      socket.emit(
        "createGame",
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

            navigate(`/game/${gameInfo.gameId}`, { state: locationState });
          }
        },
      );
    },
    [gameName, isShortenedGame, navigate, socket, username],
  );

  return {
    error,
    gameName,
    isCreatingGame,
    onSubmit,
    setGameName,
    setUsername,
    username,
  };
}

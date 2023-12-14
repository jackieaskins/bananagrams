import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSavedUsername } from "../LocalStorageContext";
import ErrorAlert from "../alerts/ErrorAlert";
import InputField from "../forms/InputField";
import CenteredLayout from "../layouts/CenteredLayout";
import { useSocket } from "../socket/SocketContext";
import { GameInfo, GameLocationState } from "./types";

export default function CreateGame(): JSX.Element {
  const [savedUsername, setSavedUsername] = useSavedUsername();
  const [gameName, setGameName] = useState("");
  const [username, setUsername] = useState(savedUsername);
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
      setSavedUsername(username);

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

            navigate(`./game/${gameInfo.gameId}`, {
              state: locationState,
            });
          }
        },
      );
    },
    [gameName, isShortenedGame, navigate, setSavedUsername, socket, username],
  );

  return (
    <CenteredLayout>
      <Box as="form" autoComplete="off" onSubmit={onSubmit}>
        <Stack spacing={6}>
          <Heading as="h1" textAlign="center">
            Start a new game
          </Heading>

          <Stack>
            <ErrorAlert visible={!!error}>{error}</ErrorAlert>

            <InputField
              label="Game name"
              name="gameName"
              isRequired
              value={gameName}
              setValue={setGameName}
            />

            <InputField
              label="Username"
              name="username"
              isRequired
              value={username}
              setValue={setUsername}
              autoComplete="username"
            />
          </Stack>

          <Button
            colorScheme="blue"
            isLoading={isCreatingGame}
            loadingText="Creating game"
            type="submit"
          >
            Create game
          </Button>
        </Stack>
      </Box>
    </CenteredLayout>
  );
}

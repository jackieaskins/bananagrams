import {
  Box,
  Button,
  Link as ChakraLink,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import {
  Link as ReactRouterLink,
  useNavigate,
  useParams,
} from "react-router-dom";
import ErrorAlert from "../alerts/ErrorAlert";
import CheckboxField from "../forms/CheckboxField";
import InputField from "../forms/InputField";
import { useSocket } from "../socket/SocketContext";
import { GameInfo, GameLocationState } from "./types";

type JoinGameParams = {
  gameId: string;
};

export default function JoinGameForm(): JSX.Element {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { gameId } = useParams<JoinGameParams>() as JoinGameParams;

  const [username, setUsername] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const [error, setError] = useState("");
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      setIsJoiningGame(true);

      socket.emit(
        "joinGame",
        { gameId, username, isSpectator },
        (error: Error | null, gameInfo: GameInfo) => {
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
    [gameId, isSpectator, navigate, socket, username],
  );

  return (
    <Box as="form" autoComplete="off" onSubmit={onSubmit}>
      <Stack spacing={6}>
        <Heading as="h1" textAlign="center">
          Join game
        </Heading>

        <Stack>
          <ErrorAlert visible={!!error}>{error}</ErrorAlert>

          <InputField
            label="Username"
            name="username"
            isRequired
            value={username}
            setValue={setUsername}
          />

          <CheckboxField
            name="isSpectator"
            checked={isSpectator}
            setChecked={setIsSpectator}
            helperText="Note: You will automatically be made a specator if you join while a game is in progress"
          >
            Join as spectator
          </CheckboxField>
        </Stack>

        <Button
          colorScheme="blue"
          isLoading={isJoiningGame}
          loadingText="Joining game"
          type="submit"
        >
          Join game
        </Button>

        <ChakraLink as={ReactRouterLink} to="/" textAlign="center">
          Go home
        </ChakraLink>
      </Stack>
    </Box>
  );
}

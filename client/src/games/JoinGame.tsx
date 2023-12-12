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
import { useSavedUsername } from "../LocalStorageContext";
import ErrorAlert from "../alerts/ErrorAlert";
import CheckboxField from "../forms/CheckboxField";
import InputField from "../forms/InputField";
import CenteredLayout from "../layouts/CenteredLayout";
import { useSocket } from "../socket/SocketContext";
import { GameInfo, GameLocationState } from "./types";

type JoinGameParams = {
  gameId: string;
};

export default function JoinGame(): JSX.Element {
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { gameId } = useParams<JoinGameParams>() as JoinGameParams;

  const [savedUsername, setSavedUsername] = useSavedUsername();
  const [username, setUsername] = useState(savedUsername);
  const [isSpectator, setIsSpectator] = useState(false);
  const [error, setError] = useState("");
  const [isJoiningGame, setIsJoiningGame] = useState(false);

  const onSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      setIsJoiningGame(true);
      setSavedUsername(username);

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

            navigate("..", { state: locationState, relative: "path" });
          }
        },
      );
    },
    [gameId, isSpectator, navigate, setSavedUsername, socket, username],
  );

  return (
    <CenteredLayout>
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
              autoComplete={username}
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

          <ChakraLink
            as={ReactRouterLink}
            to="../../.."
            textAlign="center"
            relative="path"
          >
            Go home
          </ChakraLink>
        </Stack>
      </Box>
    </CenteredLayout>
  );
}

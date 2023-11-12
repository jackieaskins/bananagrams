import {
  Box,
  Button,
  Heading,
  Link as ChakraLink,
  Stack,
} from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import ErrorAlert from "../alerts/ErrorAlert";
import TextField from "../forms/TextField";
import { useJoinGameForm } from "./JoinGameFormState";

export default function JoinGameForm(): JSX.Element {
  const { error, isJoiningGame, onSubmit, setUsername, username } =
    useJoinGameForm();

  return (
    <Box
      as="form"
      autoComplete="off"
      onSubmit={onSubmit}
      width="40vw"
      textAlign="center"
    >
      <Stack spacing={6}>
        <Heading as="h1">Join game</Heading>

        <Stack>
          <ErrorAlert visible={!!error}>{error}</ErrorAlert>

          <TextField
            label="Username"
            name="username"
            isRequired
            value={username}
            setValue={setUsername}
          />
        </Stack>

        <Button
          colorScheme="blue"
          isLoading={isJoiningGame}
          loadingText="Joining game"
          type="submit"
        >
          Join game
        </Button>

        <ChakraLink as={ReactRouterLink} to="/">
          Go home
        </ChakraLink>
      </Stack>
    </Box>
  );
}

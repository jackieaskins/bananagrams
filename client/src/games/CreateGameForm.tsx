import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import ErrorAlert from "../alerts/ErrorAlert";
import InputField from "../forms/InputField";
import { useCreateGameForm } from "./CreateGameFormState";

export default function CreateGameForm(): JSX.Element {
  const {
    error,
    gameName,
    isCreatingGame,
    onSubmit,
    setGameName,
    setUsername,
    username,
  } = useCreateGameForm();

  return (
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
  );
}

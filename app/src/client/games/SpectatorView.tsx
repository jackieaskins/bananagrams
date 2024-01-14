import { Container, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useGame } from "./GameContext";
import PlayerPreview from "@/client/redesign/PlayerPreview";
import { PlayerStatus } from "@/types/player";

const TILE_SIZE = 16;

export default function SpectatorView(): JSX.Element {
  const {
    gameInfo: { players, bunch },
  } = useGame();

  const activePlayers = useMemo(
    () => players.filter(({ status }) => status === PlayerStatus.READY),
    [players],
  );

  return (
    <Container maxWidth="container.xl" marginTop="50px" centerContent>
      <Stack spacing={6} textAlign="center" width="100%">
        <Stack>
          <Heading as="h1">Spectator view</Heading>
          <Text>Remaining tiles: {bunch.length}</Text>
        </Stack>

        <Flex direction="row" wrap="wrap" justifyContent="space-evenly">
          {activePlayers.map(({ userId, username, board, hand }) => (
            <Stack key={userId}>
              <PlayerPreview board={board} hand={hand} tileSize={TILE_SIZE} />
              <Text>{username}</Text>
            </Stack>
          ))}
        </Flex>
      </Stack>
    </Container>
  );
}

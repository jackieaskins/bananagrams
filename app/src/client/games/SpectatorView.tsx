import {
  Card,
  CardBody,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { useGame } from "./GameContext";
import PreviewBoard from "@/client/boards/PreviewBoard";
import PreviewHand from "@/client/hands/PreviewHand";
import { PlayerStatus } from "@/types/player";

const TILE_SIZE = 15;

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
      <Stack spacing={6} textAlign="center">
        <Stack>
          <Heading as="h1">Spectator view</Heading>
          <Text>Remaining tiles: {bunch.length}</Text>
        </Stack>

        <Flex direction="row" wrap="wrap" justifyContent="space-around">
          {activePlayers.map(({ userId, username, board, hand }) => (
            <Card key={userId} marginBottom="20px">
              <Stack as={CardBody}>
                <PreviewBoard board={board} tileSize={TILE_SIZE} />
                <PreviewHand hand={hand} tileSize={TILE_SIZE} />
                <Text>{username}</Text>
              </Stack>
            </Card>
          ))}
        </Flex>
      </Stack>
    </Container>
  );
}

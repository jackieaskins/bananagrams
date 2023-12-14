import { Center, HStack, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Player, PlayerStatus } from "../../types/player";
import Board from "../boards/Board";
import OpponentBoardPreview from "../boards/OpponentBoardPreview";
import Dump from "../hands/Dump";
import Hand from "../hands/Hand";
import { useSocket } from "../socket/SocketContext";
import { useGame } from "./GameContext";
import GameSettings from "./GameSettings";
import PeelButton from "./PeelButton";
import SpectateButton from "./SpectateButton";

export default function Game(): JSX.Element {
  const { socket } = useSocket();
  const {
    gameInfo: { bunch, players },
  } = useGame();

  const { board, hand } = players.find(
    (player) => player.userId === socket.id,
  ) as Player;

  const activePlayers = useMemo(
    () => players.filter(({ status }) => status === PlayerStatus.READY),
    [players],
  );

  return (
    // @ts-expect-error DndProvider doesn't work well with React.FC change
    <DndProvider backend={HTML5Backend}>
      <Center margin="50px">
        <Stack
          spacing={8}
          justifyContent="center"
          alignItems={{ base: "center", lg: "start" }}
          direction={{ base: "column", lg: "row" }}
        >
          <Stack>
            <Text textAlign="center">Your board and hand:</Text>

            <HStack>
              <Board board={board} />
              <Hand hand={hand} />
            </HStack>
          </Stack>

          <Stack flex="1" direction={{ base: "row", lg: "column" }}>
            <Stack>
              <Text textAlign="center">
                Tiles remaining in bunch: {bunch.length}
              </Text>
              <PeelButton />
              <Dump />
              <SpectateButton />
              <GameSettings />
            </Stack>

            {activePlayers.length > 1 && (
              <Stack>
                <Text textAlign="center">Opponent board(s):</Text>
                <OpponentBoardPreview players={activePlayers} />
              </Stack>
            )}
          </Stack>
        </Stack>
      </Center>
    </DndProvider>
  );
}

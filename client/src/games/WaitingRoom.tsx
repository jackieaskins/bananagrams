import {
  Button,
  HStack,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useMemo } from "react";
import { FaRegCopy } from "react-icons/fa6";
import OpponentBoardPreview from "../boards/OpponentBoardPreview";
import PlayerTable from "../players/PlayerTable";
import { PlayerStatus } from "../players/types";
import { useSocket } from "../socket/SocketContext";
import { useGame } from "./GameContext";

export default function WaitingRoom(): JSX.Element {
  const {
    gameInfo: { gameName, players, previousSnapshot },
  } = useGame();
  const { socket } = useSocket();
  const toast = useToast();

  const copyInviteLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.href}/join`);

      toast({
        description: "Successfully copied invite link to clipboard",
        status: "success",
      });
    } catch (e) {
      toast({
        description:
          "Unable to copy invite link, try copying the current page URL directly",
        status: "error",
      });
    }
  }, [toast]);

  const canStartGame = useMemo(() => {
    const activePlayers = players.filter(
      ({ status }) => status !== PlayerStatus.SPECTATING,
    );

    return (
      activePlayers.length > 0 &&
      activePlayers.every(({ status }) => status === PlayerStatus.READY)
    );
  }, [players]);

  return (
    <Stack marginTop="50px" alignItems="center" spacing={8}>
      <HStack spacing={3} align="center">
        <Heading as="h1" textAlign="center">
          {gameName}
        </Heading>

        <Button
          leftIcon={<FaRegCopy />}
          width="fit-content"
          size="sm"
          onClick={copyInviteLink}
        >
          Copy invite link
        </Button>
      </HStack>

      <Stack
        alignItems={{ base: "center", md: "start" }}
        spacing={8}
        direction={{ base: "column", md: "row" }}
      >
        <Stack>
          <Button
            colorScheme="blue"
            isDisabled={!canStartGame}
            onClick={() => socket.emit("split", {})}
          >
            Start game
          </Button>
          <PlayerTable />
        </Stack>

        {previousSnapshot && (
          <Stack>
            <Text textAlign="center">Here are the boards from that round:</Text>

            <OpponentBoardPreview
              initialPlayerIndex={previousSnapshot.findIndex(
                (player) => player.isTopBanana,
              )}
              players={previousSnapshot}
              includeCurrentPlayer
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}

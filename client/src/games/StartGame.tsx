import { Button, HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { FaRegCopy } from "react-icons/fa6";
import OpponentBoardPreview from "../boards/OpponentBoardPreview";
import { useCopyToClipboard } from "../helpers/copyToClipboard";
import PlayerList from "../players/PlayerList";
import { useGame } from "./GameContext";

export default function StartGame(): JSX.Element {
  const {
    gameInfo: { gameName, previousSnapshot },
  } = useGame();
  const { canCopy, copyToClipboard } = useCopyToClipboard();
  const joinUrl = `${window.location.href}/join`;

  return (
    <Stack marginTop="50px" alignItems="center" spacing={8}>
      <HStack spacing={3} align="center">
        <Heading as="h1" textAlign="center">
          {gameName}
        </Heading>

        {canCopy && (
          <Button
            leftIcon={<FaRegCopy />}
            width="fit-content"
            size="sm"
            onClick={() => copyToClipboard(joinUrl)}
          >
            Copy invite link
          </Button>
        )}
      </HStack>

      <Stack
        alignItems={{ base: "center", md: "start" }}
        spacing={8}
        direction={{ base: "column", md: "row" }}
      >
        <PlayerList />

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

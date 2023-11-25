import {
  Button,
  HStack,
  Heading,
  Stack,
  Text,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaRegCopy } from "react-icons/fa6";
import OpponentBoardPreview from "../boards/OpponentBoardPreview";
import PlayerTable from "../players/PlayerTable";
import { useGame } from "./GameContext";

export default function WaitingRoom(): JSX.Element {
  const {
    gameInfo: { gameName, previousSnapshot },
  } = useGame();
  const joinUrl = `${window.location.href}/join`;
  const { onCopy, hasCopied } = useClipboard(joinUrl);
  const toast = useToast();

  useEffect(() => {
    if (hasCopied) {
      toast({ description: "Successfully copied invite link to clipboard" });
    }
  }, [hasCopied, toast]);

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
          onClick={onCopy}
        >
          Copy invite link
        </Button>
      </HStack>

      <Stack
        alignItems={{ base: "center", md: "start" }}
        spacing={8}
        direction={{ base: "column", md: "row" }}
      >
        <PlayerTable />

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

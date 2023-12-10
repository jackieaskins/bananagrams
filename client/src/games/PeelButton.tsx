import { Button, ButtonProps, Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";
import { isValidConnectedBoard } from "../boards/validate";
import { PlayerStatus } from "../players/types";
import { useCurrentPlayer } from "../redesign/useCurrentPlayer";
import { useGame } from "./GameContext";

export default function PeelButton(buttonProps: ButtonProps): JSX.Element {
  const {
    gameInfo: { bunch, players },
    handlePeel,
  } = useGame();
  const { board, hand } = useCurrentPlayer();

  const activePlayers = useMemo(
    () => players.filter(({ status }) => status === PlayerStatus.READY),
    [players],
  );

  const canPeel = hand.length === 0 && isValidConnectedBoard(board);
  const peelWinsGame = bunch.length < activePlayers.length;

  const peelButtonHint = useMemo(() => {
    if (!canPeel) {
      return "You must have a valid connected board to peel";
    }

    if (peelWinsGame) {
      return "Win the game!";
    }

    return "Get a new tile and send one to everyone else";
  }, [canPeel, peelWinsGame]);

  return (
    <Tooltip label={<Text textAlign="center">{peelButtonHint}</Text>} hasArrow>
      <Button
        colorScheme="blue"
        {...buttonProps}
        onClick={handlePeel}
        isDisabled={!canPeel}
      >
        {peelWinsGame ? "Bananas!" : "Peel!"}
      </Button>
    </Tooltip>
  );
}

import { Button, Text, Tooltip } from "@chakra-ui/react";
import { useMemo } from "react";

type PeelButtonProps = {
  canPeel: boolean;
  handlePeel: () => void;
  peelWinsGame: boolean;
};

export default function PeelButton({
  canPeel,
  handlePeel,
  peelWinsGame,
}: PeelButtonProps): JSX.Element {
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
      <Button colorScheme="blue" onClick={handlePeel} isDisabled={!canPeel}>
        {peelWinsGame ? "Bananas!" : "Peel!"}
      </Button>
    </Tooltip>
  );
}

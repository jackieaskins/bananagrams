import {
  Button,
  ButtonProps,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { useMemo } from "react";
import { FaPlay } from "react-icons/fa6";
import { useGame } from "./GameContext";
import { isValidConnectedBoard } from "@/client/boards/validate";
import { useCurrentPlayer } from "@/client/redesign/useCurrentPlayer";
import { PlayerStatus } from "@/types/player";

export interface PeelButtonProps extends ButtonProps {
  hideText?: boolean;
}

export default function PeelButton({
  hideText,
  ...buttonProps
}: PeelButtonProps): JSX.Element {
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

  const commonProps = useMemo(
    () => ({
      ...buttonProps,
      colorScheme: "blue",
      onClick: handlePeel,
      isDisabled: !canPeel,
    }),
    [buttonProps, canPeel, handlePeel],
  );

  return (
    <Tooltip label={<Text textAlign="center">{peelButtonHint}</Text>} hasArrow>
      {hideText ? (
        <IconButton
          {...commonProps}
          icon={<FaPlay />}
          aria-label={peelWinsGame ? "Bananas!" : "Peel!"}
        />
      ) : (
        <Button {...commonProps} leftIcon={<FaPlay />}>
          {peelWinsGame ? "Bananas!" : "Peel!"}
        </Button>
      )}
    </Tooltip>
  );
}

import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { FaShuffle } from "react-icons/fa6";
import { useGame } from "@/client/games/GameContext";
import { useCurrentPlayer } from "@/client/players/useCurrentPlayer";

export interface ShuffleHandButtonProps extends ButtonProps {
  hideText?: boolean;
}

export default function ShuffleHandButton({
  hideText,
  ...buttonProps
}: ShuffleHandButtonProps): JSX.Element {
  const { handleShuffleHand } = useGame();
  const { hand } = useCurrentPlayer();

  const commonProps = useMemo(
    () => ({
      ...buttonProps,
      isDisabled: hand.length <= 1,
      onClick: handleShuffleHand,
    }),
    [buttonProps, hand.length, handleShuffleHand],
  );

  if (hideText) {
    return (
      <IconButton
        {...commonProps}
        icon={<FaShuffle />}
        aria-label="Shuffle hand"
      />
    );
  }

  return (
    <Button {...commonProps} leftIcon={<FaShuffle />}>
      Shuffle hand
    </Button>
  );
}

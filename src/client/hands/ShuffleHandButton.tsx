import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { useMemo } from "react";
import { FaShuffle } from "react-icons/fa6";
import { ClientToServerEventName } from "../../types/socket";
import { useCurrentPlayer } from "../redesign/useCurrentPlayer";
import { socket } from "../socket";

export interface ShuffleHandButtonProps extends ButtonProps {
  hideText?: boolean;
}

export default function ShuffleHandButton({
  hideText,
  ...buttonProps
}: ShuffleHandButtonProps): JSX.Element {
  const { hand } = useCurrentPlayer();

  const commonProps = useMemo(
    () => ({
      ...buttonProps,
      isDisabled: hand.length <= 1,
      onClick: () => socket.emit(ClientToServerEventName.ShuffleHand, null),
    }),
    [buttonProps, hand.length],
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

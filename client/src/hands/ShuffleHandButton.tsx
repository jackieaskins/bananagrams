import { Button, ButtonProps } from "@chakra-ui/react";
import { FaShuffle } from "react-icons/fa6";
import { useCurrentPlayer } from "../redesign/useCurrentPlayer";
import { useSocket } from "../socket/SocketContext";

export default function ShuffleHandButton(
  buttonProps: ButtonProps,
): JSX.Element {
  const { socket } = useSocket();
  const { hand } = useCurrentPlayer();

  return (
    <Button
      {...buttonProps}
      leftIcon={<FaShuffle />}
      isDisabled={hand.length <= 1}
      onClick={(): void => {
        socket.emit("shuffleHand", {});
      }}
    >
      Shuffle hand
    </Button>
  );
}

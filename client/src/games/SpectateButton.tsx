import {
  Button,
  ButtonProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { PlayerStatus } from "../players/types";
import { useSocket } from "../socket/SocketContext";

export default function SpectateButton(buttonProps: ButtonProps): JSX.Element {
  const { socket } = useSocket();

  return (
    <Popover>
      <PopoverTrigger>
        <Button {...buttonProps}>Switch to spectator</Button>
      </PopoverTrigger>

      <PopoverContent>
        <PopoverArrow />

        <PopoverHeader>Switch to spectator?</PopoverHeader>
        <PopoverCloseButton />

        <PopoverBody>
          Are you sure you want to spectate? You will not be able to play again
          until the next round.
        </PopoverBody>

        <PopoverFooter display="flex" justifyContent="flex-end">
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() =>
              socket.emit("setStatus", {
                status: PlayerStatus.SPECTATING,
              })
            }
          >
            Spectate
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

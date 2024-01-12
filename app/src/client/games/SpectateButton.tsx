import {
  Button,
  ButtonProps,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa6";
import { socket } from "@/client/socket";
import { PlayerStatus } from "@/types/player";
import { ClientToServerEventName } from "@/types/socket";

export interface SpectateButtonProps extends ButtonProps {
  hideText?: boolean;
}

export default function SpectateButton({
  hideText,
  ...buttonProps
}: SpectateButtonProps): JSX.Element {
  return (
    <Popover>
      <PopoverTrigger>
        {hideText ? (
          <IconButton
            {...buttonProps}
            icon={<FaEye />}
            aria-label="Switch to spectator"
          />
        ) : (
          <Button {...buttonProps} leftIcon={<FaEye />}>
            Switch to spectator
          </Button>
        )}
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
              socket.emit(ClientToServerEventName.SetStatus, {
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

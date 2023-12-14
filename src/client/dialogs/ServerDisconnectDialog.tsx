import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../socket/SocketContext";

export default function ServerDisconnectDialog(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure({
    onClose: () => {
      window.location.assign(
        pathname.startsWith("/redesign") ? "/redesign" : "/",
      );
    },
  });
  const { socket } = useSocket();
  const { pathname } = useLocation();

  useEffect(() => {
    socket.on("disconnect", onOpen);
  }, [onOpen, socket]);

  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={buttonRef}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>Disconnected</AlertDialogHeader>

          <AlertDialogBody>
            You have been disconnected from the server.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button colorScheme="blue" ref={buttonRef} onClick={onClose}>
              Return home
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

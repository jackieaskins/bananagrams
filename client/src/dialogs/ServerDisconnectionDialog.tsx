import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";
import { useServerDisconnectionDialog } from "./ServerDisconnectionDialogState";

export default function ServerDisconnectionDialog(): JSX.Element {
  const { shouldShowDialog, hideDialog } = useServerDisconnectionDialog();
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={shouldShowDialog}
      onClose={hideDialog}
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
            <Button colorScheme="blue" ref={buttonRef} onClick={hideDialog}>
              Return home
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

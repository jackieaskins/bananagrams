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
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { PROD } from "@/client/env";

export default function BraveBrowserDialog(): JSX.Element {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen:
      // @ts-expect-error brave object is included on navigator in Brave Browser
      PROD && navigator.brave?.isBrave() && pathname.startsWith("/redesign"),
  });

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={buttonRef}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>Brave Browser Detected</AlertDialogHeader>

        <AlertDialogBody>
          Hey! It looks like you&apos;re using the Brave Browser. Great choice,
          but unfortunately this app does not work well in Brave. Please switch
          to a different browser (or proceed at your own risk).
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={buttonRef} onClick={onClose}>
            Ok
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

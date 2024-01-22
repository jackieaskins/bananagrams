import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  Icon,
  Link,
  ListItem,
  OrderedList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { useShowBravePrompt } from "@/client/LocalStorageContext";

export default function BraveBrowserDialog(): JSX.Element {
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [showBravePrompt, setShowBravePrompt] = useShowBravePrompt();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { isOpen, onClose, onOpen } = useDisclosure({
    onOpen: () => {
      setHasBeenOpened(true);
    },
    onClose: () => {
      setShowBravePrompt(!dontShowAgain);
    },
  });

  useEffect(() => {
    void (async () => {
      if (
        !hasBeenOpened &&
        showBravePrompt &&
        // @ts-expect-error brave object is included on navigator in Brave Browser
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        (await navigator.brave?.isBrave())
      ) {
        onOpen();
      }
    })();
  }, [hasBeenOpened, onOpen, showBravePrompt]);

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
        <AlertDialogCloseButton />

        <AlertDialogBody as={Stack} spacing={4}>
          <Text>
            Hey, it looks like you&apos;re using Brave! Great choice, but
            unfortunately{" "}
            <Link
              href="https://brave.com/glossary/fingerprinting/"
              isExternal
              color="teal.500"
              textAlign="center"
            >
              Brave&apos;s fingerprinting detection{" "}
              <Icon as={FaArrowUpRightFromSquare} boxSize={3} />
            </Link>{" "}
            breaks gameplay.
          </Text>

          <Text>
            If you&apos;d like to play, either switch to another web browser or
            disable fingerprinting for this site. I promise this is safe,
            Bananagrams isn&apos;t tracking you.
          </Text>

          <Accordion allowToggle>
            <AccordionItem>
              <AccordionButton paddingX={0}>
                <Box as="span" flex="1" textAlign="left">
                  How to disable fingerprinting for just this site
                </Box>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <OrderedList>
                  <ListItem>
                    Click the Brave icon in the address bar above.
                  </ListItem>
                  <ListItem>Expand &quot;Advanced controls&quot;.</ListItem>
                  <ListItem>
                    Change &quot;Allow fingerprinting&quot; to &quot;Disable
                    fingerprinting&quot;.
                  </ListItem>
                </OrderedList>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Checkbox
            name="dontShowAgain"
            isChecked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          >
            Don&apos;t show again
          </Checkbox>
        </AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={buttonRef} onClick={onClose} colorScheme="blue">
            Ok
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

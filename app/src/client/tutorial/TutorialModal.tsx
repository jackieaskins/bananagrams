import {
  Button,
  ButtonGroup,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useShowTutorialPrompt } from "@/client/LocalStorageContext";

export default function TutorialModal(): JSX.Element {
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [showTutorialPrompt, setShowTutorialPrompt] = useShowTutorialPrompt();
  const { isOpen, onClose } = useDisclosure({
    defaultIsOpen: showTutorialPrompt,
    onClose: () => {
      setShowTutorialPrompt(!dontShowAgain);
    },
  });

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome!</ModalHeader>
        <ModalCloseButton />

        <ModalBody as={Stack}>
          <Text>
            Bananagrams has been completely redesigned! Try out the tutorial
            now.
          </Text>

          <Checkbox
            isChecked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          >
            Don&apos;t ask again
          </Checkbox>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              No thanks
            </Button>

            <Button
              as={Link}
              colorScheme="blue"
              to="/tutorial"
              onClick={onClose}
            >
              I&apos;d love to!
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

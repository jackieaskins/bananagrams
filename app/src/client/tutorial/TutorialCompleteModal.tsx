import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useGame } from "@/client/games/GameContext";

export default function TutorialCompleteModal(): JSX.Element {
  const {
    gameInfo: { isInProgress },
  } = useGame();

  return (
    <Modal
      isOpen={!isInProgress}
      onClose={() => null}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tutorial completed</ModalHeader>

        <ModalBody>
          Nice work, you now have all the knowledge you need to successfully
          play and WIN Bananagrams. Good luck, have fun!
        </ModalBody>

        <ModalFooter>
          <Button as={Link} to="/" colorScheme="blue">
            Take me home
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

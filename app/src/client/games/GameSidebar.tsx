import {
  CloseButton,
  Flex,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import PlayerAccordion from "@/client/players/PlayerAccordion";

export type GameSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GameSidebar({
  isOpen,
  onClose,
}: GameSidebarProps): JSX.Element {
  const borderColor = useColorModeValue("gray.400", "gray.700");

  return (
    <Flex
      height="100vh"
      width={isOpen ? "350px" : "0px"}
      transition="ease-in-out 0.2s"
      borderLeftWidth={1}
      borderLeftColor={borderColor}
      direction="column"
      justifyContent="space-between"
    >
      <Flex direction="column" overflowY="scroll">
        <Flex padding={4} justifyContent="space-between" alignItems="center">
          <Heading noOfLines={1} size="md" textAlign="center">
            Players
          </Heading>

          <CloseButton onClick={onClose} />
        </Flex>

        <PlayerAccordion borderColor={borderColor} />
      </Flex>
    </Flex>
  );
}

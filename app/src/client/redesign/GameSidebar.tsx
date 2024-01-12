import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBars, FaXmark } from "react-icons/fa6";
import PreviewBoard from "@/client/boards/PreviewBoard";
import { useGame } from "@/client/games/GameContext";
import PreviewHand from "@/client/hands/PreviewHand";
import { socket } from "@/client/socket";
import { SetState } from "@/client/state/types";

export type GameSidebarProps = {
  expanded: boolean;
  setExpanded: SetState<boolean>;
};

export default function GameSidebar({
  expanded,
  setExpanded,
}: GameSidebarProps): JSX.Element {
  const borderColor = useColorModeValue("gray.400", "gray.700");
  const {
    gameInfo: { players },
  } = useGame();

  if (!expanded) {
    return (
      <IconButton
        height="100vh"
        borderRadius={0}
        aria-label="Expand game sidebar"
        alignItems="start"
        paddingTop="16px"
        icon={<FaBars />}
        onClick={() => setExpanded(true)}
      />
    );
  }

  return (
    <Flex
      height="100vh"
      width="350px"
      borderLeftWidth={1}
      borderLeftColor={borderColor}
      direction="column"
      justifyContent="space-between"
    >
      <Flex direction="column" overflowY="scroll">
        <Box
          paddingX="10"
          paddingY="4"
          borderBottomWidth={1}
          borderBottomColor={borderColor}
        >
          <Heading noOfLines={1} size="md" textAlign="center">
            Players
          </Heading>
        </Box>

        <Accordion defaultIndex={[]} allowMultiple overflowY="scroll">
          {players.map(({ userId, username, hand, board }, index) => (
            <AccordionItem
              key={userId}
              isDisabled={userId === socket.id}
              borderTop={index === 0 ? 0 : undefined}
              borderBottom={index === players.length - 1 ? 0 : undefined}
              borderColor={borderColor}
            >
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left">
                    {username}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>

              <AccordionPanel pb={4}>
                <Flex direction="column">
                  <PreviewBoard board={board} tileSize={15} />
                  <PreviewHand hand={hand} tileSize={15} />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>

      <Box
        paddingY={2}
        width="100%"
        borderTopWidth={1}
        borderColor={borderColor}
      >
        <Button
          borderRadius={0}
          leftIcon={<FaXmark />}
          onClick={() => setExpanded(false)}
          width="100%"
        >
          Close
        </Button>
      </Box>
    </Flex>
  );
}

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  CloseButton,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa6";
import PlayerPreview from "./PlayerPreview";
import { useGame } from "@/client/games/GameContext";
import { socket } from "@/client/socket";
import { PlayerStatus } from "@/types/player";

export type GameSidebarProps = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
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
        <Flex
          padding={4}
          borderBottomWidth={1}
          borderBottomColor={borderColor}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading noOfLines={1} size="md" textAlign="center">
            Players
          </Heading>

          <CloseButton onClick={() => setExpanded(false)} />
        </Flex>

        <Accordion allowMultiple overflowY="scroll">
          {players.map(({ userId, username, hand, board, status }, index) => (
            <AccordionItem
              key={userId}
              isDisabled={userId === socket.id}
              borderTop={index === 0 ? 0 : undefined}
              borderBottom={index === players.length - 1 ? 0 : undefined}
              borderColor={borderColor}
            >
              {(isExpanded) => (
                <>
                  <h2>
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {username}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>

                  <AccordionPanel>
                    {isExpanded ? (
                      status === PlayerStatus.SPECTATING ? (
                        <Text textAlign="center">{username} is spectating</Text>
                      ) : (
                        <Flex direction="column">
                          <PlayerPreview
                            board={board}
                            hand={hand}
                            tileSize={16}
                          />
                        </Flex>
                      )
                    ) : null}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </Flex>
    </Flex>
  );
}

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import PlayerPreview from "./PlayerPreview";
import { useGame } from "@/client/games/GameContext";
import { socket } from "@/client/socket";
import { PlayerStatus } from "@/types/player";

type PlayerAccordionProps = {
  borderColor: string;
};

export default function PlayerAccordion({
  borderColor,
}: PlayerAccordionProps): JSX.Element {
  const {
    gameInfo: { players },
  } = useGame();

  return (
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
                      <PlayerPreview board={board} hand={hand} tileSize={16} />
                    </Flex>
                  )
                ) : null}
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

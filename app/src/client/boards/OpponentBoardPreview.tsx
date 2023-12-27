import {
  Flex,
  HStack,
  IconButton,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Player } from "../../types/player";
import PreviewHand from "../hands/PreviewHand";
import { socket } from "../socket";
import { useOpponentBoardPreview } from "./OpponentBoardPreviewState";
import PreviewBoard from "./PreviewBoard";

type OpponentBoardPreviewProps = {
  initialPlayerIndex?: number;
  players: Player[];
  tileSize?: number;
  includeCurrentPlayer?: boolean;
};

const EMPTY_BOARD = [...Array(21)].map(() => Array(21).fill(null));

export default function OpponentBoardPreview({
  initialPlayerIndex = 0,
  players,
  tileSize = 15,
  includeCurrentPlayer = false,
}: OpponentBoardPreviewProps): JSX.Element | null {
  const opponents = includeCurrentPlayer
    ? players
    : players.filter((player) => player.userId !== socket.id);
  const {
    handleLeftClick,
    handleRightClick,
    handleSelectedPlayerChange,
    selectedPlayerIndex,
    selectedUserId,
  } = useOpponentBoardPreview(opponents, initialPlayerIndex);

  if (opponents.length === 0) {
    return null;
  }

  const selectedOpponent = opponents[selectedPlayerIndex];
  const selectedBoard = selectedOpponent?.board ?? EMPTY_BOARD;
  const selectedHand = selectedOpponent?.hand ?? [];
  const hasOneOpponent = opponents.length === 1;

  return (
    <Stack>
      <Flex direction="column">
        <PreviewBoard board={selectedBoard} tileSize={tileSize} />
        <PreviewHand hand={selectedHand} tileSize={tileSize} />
      </Flex>

      <HStack spacing={4}>
        {hasOneOpponent ? (
          <Text textAlign="center" width="100%">
            {opponents[0].username}
          </Text>
        ) : (
          <>
            <IconButton
              aria-label="See previous opponent's board"
              icon={<FaChevronLeft />}
              onClick={handleLeftClick}
              variant="outline"
            />

            <Select
              value={selectedUserId}
              onChange={handleSelectedPlayerChange}
            >
              {opponents.map(({ userId, username }) => (
                <option value={userId} key={userId}>
                  {username}
                </option>
              ))}
            </Select>

            <IconButton
              aria-label="See next opponent's board"
              icon={<FaChevronRight />}
              onClick={handleRightClick}
              variant="outline"
            />
          </>
        )}
      </HStack>
    </Stack>
  );
}

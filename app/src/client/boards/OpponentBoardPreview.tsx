import { HStack, IconButton, Select, Stack, Text } from "@chakra-ui/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import PlayerPreview from "@/client/redesign/PlayerPreview";
import { socket } from "@/client/socket";
import { Board } from "@/types/board";
import { Player } from "@/types/player";

type OpponentBoardPreviewProps = {
  initialPlayerIndex?: number;
  players: Player[];
  tileSize?: number;
  includeCurrentPlayer?: boolean;
};

const EMPTY_BOARD: Board = {};

export default function OpponentBoardPreview({
  initialPlayerIndex = 0,
  players,
  tileSize = 15,
  includeCurrentPlayer = false,
}: OpponentBoardPreviewProps): JSX.Element | null {
  const opponents = includeCurrentPlayer
    ? players
    : players.filter((player) => player.userId !== socket.id);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    opponents[initialPlayerIndex]?.userId,
  );

  useEffect(() => {
    if (!opponents.some(({ userId }) => userId === selectedUserId)) {
      setSelectedUserId(opponents[0]?.userId);
    }
  }, [opponents, selectedUserId]);

  const selectedPlayerIndex = useMemo(() => {
    const foundIndex = opponents.findIndex(
      ({ userId }) => userId === selectedUserId,
    );
    return foundIndex < 0 ? 0 : foundIndex;
  }, [opponents, selectedUserId]);

  const handleLeftClick = useCallback(() => {
    const index =
      selectedPlayerIndex <= 0 ? opponents.length - 1 : selectedPlayerIndex - 1;
    setSelectedUserId(opponents[index]?.userId);
  }, [opponents, selectedPlayerIndex]);

  const handleRightClick = useCallback(() => {
    const index =
      selectedPlayerIndex >= opponents.length - 1 ? 0 : selectedPlayerIndex + 1;
    setSelectedUserId(opponents[index]?.userId);
  }, [opponents, selectedPlayerIndex]);

  const handleSelectedPlayerChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedUserId(e.target.value);
    },
    [],
  );

  if (opponents.length === 0) {
    return null;
  }

  const selectedOpponent = opponents[selectedPlayerIndex];
  const selectedBoard = selectedOpponent?.board ?? EMPTY_BOARD;
  const selectedHand = selectedOpponent?.hand ?? [];
  const hasOneOpponent = opponents.length === 1;

  return (
    <Stack width="300px">
      <PlayerPreview
        board={selectedBoard}
        hand={selectedHand}
        tileSize={tileSize}
      />

      <HStack spacing={4} width="100%">
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
              size="sm"
            />

            <Select
              value={selectedUserId}
              onChange={handleSelectedPlayerChange}
              size="sm"
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
              size="sm"
            />
          </>
        )}
      </HStack>
    </Stack>
  );
}

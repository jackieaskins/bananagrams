import {
  Checkbox,
  HStack,
  Icon,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  FaCheck,
  FaCrown,
  FaKey,
  FaRegTrashCan,
  FaXmark,
} from "react-icons/fa6";
import { useGame } from "../games/GameContext";
import { useSocket } from "../socket/SocketContext";

const MAX_PLAYERS = 16;

export default function PlayerList(): JSX.Element {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  const players = gameInfo?.players ?? [];
  const isCurrentPlayerAdmin =
    players.find(({ userId }) => userId === socket.id)?.isAdmin ?? false;

  return (
    <TableContainer>
      <Table variant="simple">
        <TableCaption>
          Current player count: {players.length}/{MAX_PLAYERS} max
        </TableCaption>

        <Thead>
          <Tr>
            <Th>Ready?</Th>
            <Th>Player</Th>
            <Th isNumeric>Games won</Th>
            {isCurrentPlayerAdmin && players.length > 1 && <Th />}
          </Tr>
        </Thead>

        <Tbody>
          {players.map(
            ({ gamesWon, isReady, isTopBanana, isAdmin, userId, username }) => {
              const isCurrentUser = userId === socket.id;
              const ReadyIcon = isReady ? FaCheck : FaXmark;
              const readyColor = isReady ? "green.400" : "red.500";

              return (
                <Tr key={userId}>
                  <Td textAlign="center">
                    {isCurrentUser ? (
                      <Checkbox
                        colorScheme="green"
                        checked={isReady}
                        onChange={({ target: { checked } }) => {
                          socket.emit("ready", { isReady: checked });
                        }}
                      />
                    ) : (
                      <Icon as={ReadyIcon} color={readyColor} />
                    )}
                  </Td>

                  <Td>
                    <HStack>
                      <span>{username}</span>
                      {isAdmin && <Icon as={FaKey} boxSize={3} />}
                      {isTopBanana && <Icon as={FaCrown} boxSize={3} />}
                    </HStack>
                  </Td>

                  <Td isNumeric>{gamesWon}</Td>

                  {isCurrentPlayerAdmin && players.length > 1 && (
                    <Td>
                      {!isCurrentUser && (
                        <IconButton
                          aria-label={`Kick ${username} from the game`}
                          icon={<FaRegTrashCan />}
                          size="small"
                          onClick={(): void => {
                            socket.emit("kickPlayer", { userId });
                          }}
                        />
                      )}
                    </Td>
                  )}
                </Tr>
              );
            },
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

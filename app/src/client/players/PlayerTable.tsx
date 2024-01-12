import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PlayerTableRow from "./PlayerTableRow";
import { useGame } from "@/client/games/GameContext";
import { socket } from "@/client/socket";

const MAX_PLAYERS = 16;

export default function PlayerTable(): JSX.Element {
  const { gameInfo } = useGame();

  const players = gameInfo.players;
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
            <Th textAlign="right">Status</Th>
            <Th>Player</Th>
            <Th isNumeric>Games won</Th>
            {isCurrentPlayerAdmin && players.length > 1 && <Th />}
          </Tr>
        </Thead>

        <Tbody>
          {players.map((player) => (
            <PlayerTableRow
              key={player.userId}
              isCurrentPlayerAdmin={isCurrentPlayerAdmin}
              player={player}
              playerCount={players.length}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

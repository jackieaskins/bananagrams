import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import { Check, Close, DeleteOutline } from "@mui/icons-material";

import { useSocket } from "../socket/SocketContext";
import { useGame } from "../games/GameContext";

const MAX_PLAYERS = 16;

const PlayerList: React.FC = () => {
  const { socket } = useSocket();
  const { gameInfo } = useGame();

  const players = gameInfo?.players ?? [];
  const isCurrentPlayerAdmin =
    players.find(({ userId }) => userId === socket.id)?.isAdmin ?? false;

  return (
    <TableContainer>
      <Table>
        <caption style={{ textAlign: "center" }}>
          <div>The game will start once all players are ready</div>
          <div>
            Current player count: {players.length}/{MAX_PLAYERS} max
          </div>
        </caption>

        <TableHead>
          <TableRow>
            <TableCell align="center">Ready?</TableCell>
            <TableCell>Player</TableCell>
            <TableCell align="right">Games Won</TableCell>
            {isCurrentPlayerAdmin && players.length > 1 && <TableCell />}
          </TableRow>
        </TableHead>

        <TableBody>
          {players.map(
            ({ gamesWon, isReady, isTopBanana, isAdmin, userId, username }) => {
              const isCurrentUser = userId === socket.id;
              const ReadyIcon = isReady ? Check : Close;
              const readyColor = isReady ? "green" : "red";

              return (
                <TableRow
                  key={userId}
                  style={{
                    backgroundColor: isCurrentUser
                      ? "rgba(0, 0, 0, 0.08)"
                      : "inherit",
                  }}
                >
                  <TableCell
                    padding={isCurrentUser ? "checkbox" : undefined}
                    align="center"
                  >
                    {isCurrentUser ? (
                      <Checkbox
                        style={{ color: readyColor }}
                        checked={isReady}
                        onChange={({ target: { checked } }): void => {
                          socket.emit("ready", { isReady: checked });
                        }}
                      />
                    ) : (
                      <ReadyIcon style={{ color: readyColor }} />
                    )}
                  </TableCell>

                  <TableCell>
                    {username}
                    {isAdmin ? " - Admin" : ""}
                    {isTopBanana ? " - Winner" : ""}
                  </TableCell>

                  <TableCell align="right">{gamesWon}</TableCell>

                  {isCurrentPlayerAdmin && players.length > 1 && (
                    <TableCell>
                      {!isCurrentUser && (
                        <IconButton
                          size="small"
                          onClick={(): void => {
                            socket.emit("kickPlayer", { userId });
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            },
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayerList;

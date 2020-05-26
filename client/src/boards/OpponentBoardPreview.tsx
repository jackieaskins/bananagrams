import React, { useState, useEffect } from 'react';

import Button from '../buttons/Button';
import PreviewBoard from './PreviewBoard';
import { useGame } from '../games/GameContext';
import { useSocket } from '../SocketContext';
import { Box, Grid, MenuItem, TextField, Typography } from '@material-ui/core';

const EMPTY_BOARD = [...Array(21)].map(() => Array(21).fill(null));

const OpponentBoardPreview: React.FC = () => {
  const {
    socket: { id: userId },
  } = useSocket();
  const {
    gameInfo: { players },
  } = useGame();

  const opponents = players.filter((player) => player.userId !== userId);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    opponents[0]?.userId
  );

  useEffect(() => {
    if (!opponents.some(({ userId }) => userId === selectedUserId)) {
      setSelectedUserId(opponents[0]?.userId);
    }
  }, [opponents, selectedUserId]);

  if (opponents.length === 0) {
    return null;
  }

  const selectedPlayerIndex =
    opponents.findIndex(({ userId }) => userId === selectedUserId) ?? 0;
  const selectedBoard = opponents[selectedPlayerIndex]?.board;

  return (
    <Grid container direction="column" alignItems="center" spacing={1}>
      <Grid item>
        <Typography variant="body2">
          {opponents.length === 1 ? "Opponent's board:" : "Opponents' boards:"}
        </Typography>
      </Grid>
      <Grid item>
        <PreviewBoard board={selectedBoard ?? EMPTY_BOARD} tileSize={15} />
      </Grid>
      <Grid item style={{ width: '100%' }}>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="outlined"
            size="small"
            disabled={opponents.length <= 1 || selectedPlayerIndex <= 0}
            onClick={(): void => {
              setSelectedUserId(opponents[selectedPlayerIndex - 1]?.userId);
            }}
          >
            {'<'}
          </Button>
          <TextField
            select
            size="small"
            value={selectedUserId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setSelectedUserId(e.target.value);
            }}
          >
            {opponents.map(({ userId, username }) => (
              <MenuItem value={userId} key={userId}>
                {username}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            size="small"
            disabled={
              opponents.length <= 1 ||
              selectedPlayerIndex >= opponents.length - 1
            }
            onClick={(): void => {
              setSelectedUserId(opponents[selectedPlayerIndex + 1]?.userId);
            }}
          >
            {'>'}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default OpponentBoardPreview;

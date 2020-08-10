import React, { useState, useEffect } from 'react';

import Button from '../buttons/Button';
import PreviewBoard from './PreviewBoard';
import { useSocket } from '../socket/SocketContext';
import { Box, Grid, MenuItem, TextField, Typography } from '@material-ui/core';
import PreviewHand from '../hands/PreviewHand';
import { Player } from '../players/types';

type OpponentBoardPreviewProps = {
  initialPlayerIndex?: number;
  players: Player[] | null;
  tileSize?: number;
};

const EMPTY_BOARD = [...Array(21)].map(() => Array(21).fill(null));

const OpponentBoardPreview: React.FC<OpponentBoardPreviewProps> = ({
  initialPlayerIndex = 0,
  players,
  tileSize = 15,
}) => {
  const {
    socket: { id: userId },
  } = useSocket();

  const opponents = players?.filter((player) => player.userId !== userId) ?? [];
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    opponents[initialPlayerIndex]?.userId
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
  const selectedHand = opponents[selectedPlayerIndex]?.hand;

  return (
    <Grid container direction="column" alignItems="center" spacing={1}>
      <Grid item>
        <Typography variant="body2">
          {opponents.length === 1 ? "Opponent's board:" : "Opponents' boards:"}
        </Typography>
      </Grid>
      <Grid item>
        <Box flexDirection="column" width="317px">
          <PreviewBoard
            board={selectedBoard ?? EMPTY_BOARD}
            tileSize={tileSize}
          />
          <PreviewHand hand={selectedHand ?? []} tileSize={tileSize} />
        </Box>
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

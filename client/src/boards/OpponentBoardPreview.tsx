import PreviewBoard from './PreviewBoard';
import { useSocket } from '../socket/SocketContext';
import { Box, Grid, IconButton, MenuItem, TextField } from '@material-ui/core';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import PreviewHand from '../hands/PreviewHand';
import { Player } from '../players/types';
import { useOpponentBoardPreview } from './OpponentBoardPreviewState';

type OpponentBoardPreviewProps = {
  initialPlayerIndex?: number;
  players: Player[];
  tileSize?: number;
  includeCurrentPlayer?: boolean;
};

const EMPTY_BOARD = [...Array(21)].map(() => Array(21).fill(null));

const OpponentBoardPreview: React.FC<OpponentBoardPreviewProps> = ({
  initialPlayerIndex = 0,
  players,
  tileSize = 15,
  includeCurrentPlayer = false,
}) => {
  const {
    socket: { id: userId },
  } = useSocket();

  const opponents = includeCurrentPlayer
    ? players
    : players.filter((player) => player.userId !== userId);
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
    <Grid container direction="column" alignItems="center" spacing={1}>
      <Grid item>
        <Box flexDirection="column" width="317px">
          <PreviewBoard board={selectedBoard} tileSize={tileSize} />
          <PreviewHand hand={selectedHand} tileSize={tileSize} />
        </Box>
      </Grid>

      <Grid item style={{ width: '100%' }}>
        <Box display="flex" justifyContent="space-between">
          <IconButton
            size="small"
            disabled={hasOneOpponent}
            onClick={handleLeftClick}
          >
            <NavigateBefore fontSize="small" />
          </IconButton>

          <TextField
            select
            size="small"
            value={selectedUserId}
            onChange={handleSelectedPlayerChange}
            disabled={hasOneOpponent}
          >
            {opponents.map(({ userId, username }) => (
              <MenuItem value={userId} key={userId}>
                {username}
              </MenuItem>
            ))}
          </TextField>

          <IconButton
            size="small"
            disabled={hasOneOpponent}
            onClick={handleRightClick}
          >
            <NavigateNext fontSize="small" />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default OpponentBoardPreview;

import { Box, Grid, Typography } from "@mui/material";
import OpponentBoardPreview from "../boards/OpponentBoardPreview";
import CopyToClipboard from "../buttons/CopyToClipboard";
import PlayerList from "../players/PlayerList";
import { useGame } from "./GameContext";

const StartGame: React.FC = () => {
  const {
    gameInfo: { gameName, previousSnapshot },
  } = useGame();
  const joinUrl = `${window.location.href}/join`;

  return (
    <Box>
      <Typography variant="h3" align="center" gutterBottom>
        {gameName}
      </Typography>
      <Typography variant="body1" align="center" color="textSecondary">
        Invite others to game:
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="textSecondary"
        gutterBottom
      >
        {joinUrl} <CopyToClipboard copyText={joinUrl} />
      </Typography>

      <Grid container justifyContent="center" spacing={3}>
        <Grid item md={5}>
          <PlayerList />
        </Grid>
        {previousSnapshot && (
          <Grid item>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1" align="center" gutterBottom>
                Here are the boards from that round:
              </Typography>

              <OpponentBoardPreview
                initialPlayerIndex={previousSnapshot.findIndex(
                  (player) => player.isTopBanana,
                )}
                players={previousSnapshot}
                includeCurrentPlayer
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StartGame;

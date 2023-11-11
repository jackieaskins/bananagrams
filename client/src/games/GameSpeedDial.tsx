import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import { ExitToApp } from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useGameSpeedDial } from "./GameSpeedDialState";

const GameSpeedDial: React.FC = () => {
  const { leaveGameDialogOpen, showLeaveGameDialog, handleLeaveGameCancel } =
    useGameSpeedDial();

  return (
    <>
      <SpeedDial
        ariaLabel="Leave game speed dial"
        sx={{ position: "absolute", bottom: 10, right: 10 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<ExitToApp />}
          tooltipTitle="Leave game"
          onClick={showLeaveGameDialog}
        />
      </SpeedDial>

      <Dialog open={leaveGameDialogOpen} onClose={handleLeaveGameCancel}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave the game?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLeaveGameCancel}>No</Button>
          <Button component={Link} to="/" color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GameSpeedDial;

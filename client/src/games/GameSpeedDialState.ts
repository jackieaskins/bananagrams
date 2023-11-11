import { useState } from 'react';

type GameSpeedDialState = {
  leaveGameDialogOpen: boolean;
  showLeaveGameDialog: () => void;
  handleLeaveGameCancel: () => void;
};

export const useGameSpeedDial = (): GameSpeedDialState => {
  const [leaveGameDialogOpen, setLeaveGameDialogOpen] = useState(false);

  const showLeaveGameDialog = (): void => {
    setLeaveGameDialogOpen(true);
  };
  const handleLeaveGameCancel = (): void => {
    setLeaveGameDialogOpen(false);
  };

  return {
    leaveGameDialogOpen,
    showLeaveGameDialog,
    handleLeaveGameCancel,
  };
};

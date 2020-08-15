import { useState } from 'react';

type GameSidebarState = {
  leaveGameDialogOpen: boolean;
  showLeaveGameDialog: () => void;
  handleLeaveGameCancel: () => void;
};

export const useGameSidebar = (): GameSidebarState => {
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

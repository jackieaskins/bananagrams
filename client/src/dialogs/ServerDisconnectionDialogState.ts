import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useSocket } from '../socket/SocketContext';

export type ServerDisconnectionDialogState = {
  shouldShowDialog: boolean;
  hideDialog: () => void;
};

export const useServerDisconnectionDialog = (): ServerDisconnectionDialogState => {
  const [shouldShowDialog, setShouldShowDialog] = useState(false);
  const { socket } = useSocket();
  const { push } = useHistory();

  useEffect(() => {
    socket.on('disconnect', () => {
      setShouldShowDialog(true);
    });
  }, [socket]);

  const hideDialog = (): void => {
    push('/');
    setShouldShowDialog(false);
  };

  return { shouldShowDialog, hideDialog };
};

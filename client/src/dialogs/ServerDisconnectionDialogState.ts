import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSocket } from "../socket/SocketContext";

export type ServerDisconnectionDialogState = {
  shouldShowDialog: boolean;
  hideDialog: () => void;
};

export const useServerDisconnectionDialog =
  (): ServerDisconnectionDialogState => {
    const [shouldShowDialog, setShouldShowDialog] = useState(false);
    const { socket } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
      socket.on("disconnect", () => {
        setShouldShowDialog(true);
      });
    }, [socket]);

    const hideDialog = (): void => {
      navigate("/");
      setShouldShowDialog(false);
    };

    return { shouldShowDialog, hideDialog };
  };

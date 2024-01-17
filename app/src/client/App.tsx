import {
  ChakraProvider,
  ThemeConfig,
  ToastProviderProps,
  extendTheme,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import LocalStorageProvider from "./LocalStorageProvider";
import BraveBrowserDialog from "./dialogs/BraveBrowserDialog";
import ServerDisconnectDialog from "./dialogs/ServerDisconnectDialog";
import NavMenu from "./menus/NavMenu";
import { NavMenuContext } from "./menus/NavMenuContext";
import { socket } from "./socket";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

const toastOptions: ToastProviderProps = {
  defaultOptions: {
    position: "top-left",
  },
};

export default function App(): JSX.Element | null {
  const [renderNavMenu, setRenderNavMenu] = useState(true);
  const [hasConnected, setHasConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setHasConnected(true);
    });
  }, []);

  if (!hasConnected) return null;

  return (
    <LocalStorageProvider>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <NavMenuContext.Provider value={[renderNavMenu, setRenderNavMenu]}>
          <BrowserRouter>
            <ServerDisconnectDialog />
            <AppRoutes />
            {renderNavMenu && <NavMenu />}
            <BraveBrowserDialog />
          </BrowserRouter>
        </NavMenuContext.Provider>
      </ChakraProvider>
    </LocalStorageProvider>
  );
}

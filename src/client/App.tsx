import {
  ChakraProvider,
  ThemeConfig,
  ToastProviderProps,
  extendTheme,
} from "@chakra-ui/react";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import LocalStorageProvider from "./LocalStorageProvider";
import ServerDisconnectDialog from "./dialogs/ServerDisconnectDialog";
import NavMenu from "./menus/NavMenu";
import { NavMenuContext } from "./menus/NavMenuContext";
import useSocketManager from "./socket/useSocketManager";

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

export default function App(): JSX.Element {
  useSocketManager();
  const [renderNavMenu, setRenderNavMenu] = useState(true);

  return (
    <LocalStorageProvider>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <NavMenuContext.Provider value={[renderNavMenu, setRenderNavMenu]}>
          <BrowserRouter>
            <ServerDisconnectDialog />
            <AppRoutes />
            {renderNavMenu && <NavMenu />}
          </BrowserRouter>
        </NavMenuContext.Provider>
      </ChakraProvider>
    </LocalStorageProvider>
  );
}

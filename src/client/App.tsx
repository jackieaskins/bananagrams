import {
  ChakraProvider,
  ThemeConfig,
  ToastProviderProps,
  extendTheme,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { LocalStorageProvider } from "./LocalStorageContext";
import ServerDisconnectDialog from "./dialogs/ServerDisconnectDialog";
import NavMenu from "./menus/NavMenu";
import SocketManager from "./socket/SocketManager";

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
  return (
    <LocalStorageProvider>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <BrowserRouter>
          <ServerDisconnectDialog />
          <AppRoutes />
          <NavMenu />
        </BrowserRouter>

        <SocketManager />
      </ChakraProvider>
    </LocalStorageProvider>
  );
}

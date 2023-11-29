import {
  ChakraProvider,
  ThemeConfig,
  ToastProviderProps,
  extendTheme,
} from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import ServerDisconnectDialog from "./dialogs/ServerDisconnectDialog";
import NavMenu from "./menus/NavMenu";
import { SocketProvider } from "./socket/SocketContext";

const config: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true,
};
const theme = extendTheme({ config });

const toastOptions: ToastProviderProps = {
  defaultOptions: {
    position: "bottom-left",
  },
};

export default function App(): JSX.Element {
  return (
    <ChakraProvider theme={theme} toastOptions={toastOptions}>
      <SocketProvider>
        <BrowserRouter>
          <ServerDisconnectDialog />
          <AppRoutes />
          <NavMenu />
        </BrowserRouter>
      </SocketProvider>
    </ChakraProvider>
  );
}

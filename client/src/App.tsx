import { CssBaseline, useMediaQuery } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./AppRoutes";
import ServerDisconnectionDialog from "./dialogs/ServerDisconnectionDialog";
import { SocketProvider } from "./socket/SocketContext";

export default function App(): JSX.Element {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <SocketProvider>
          <BrowserRouter>
            <ServerDisconnectionDialog />
            <Routes />
          </BrowserRouter>
        </SocketProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

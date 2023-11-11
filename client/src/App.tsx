import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Routes from './Routes';
import { SocketProvider } from './socket/SocketContext';
import ServerDisconnectionDialog from './dialogs/ServerDisconnectionDialog';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';

const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <SocketProvider>
          <Router>
            <ServerDisconnectionDialog />
            <Routes />
          </Router>
        </SocketProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;

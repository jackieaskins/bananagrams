import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Routes from './Routes';
import { SocketProvider } from './SocketContext';
import ServerDisconnectionDialog from './dialogs/ServerDisconnectionDialog';

const App: React.FC<{}> = () => (
  <SnackbarProvider>
    <SocketProvider>
      <Router>
        <ServerDisconnectionDialog />
        <Routes />
      </Router>
    </SocketProvider>
  </SnackbarProvider>
);

export default App;

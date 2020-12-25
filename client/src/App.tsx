import { SnackbarProvider } from 'notistack';
import React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import ServerDisconnectionDialog from './dialogs/ServerDisconnectionDialog';
import { SocketProvider } from './socket/SocketContext';

const App: React.FC = () => (
  <SnackbarProvider>
    <SocketProvider>
      <Router>
        <ServerDisconnectionDialog />
        <Routes />
      </Router>
    </SocketProvider>
  </SnackbarProvider>
);

export default hot(App);

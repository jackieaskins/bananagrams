import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import Routes from './Routes';
import { SocketProvider } from './SocketContext';

const App: React.FC<{}> = () => (
  <SnackbarProvider>
    <SocketProvider>
      <Router>
        <Routes />
      </Router>
    </SocketProvider>
  </SnackbarProvider>
);

export default App;

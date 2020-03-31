import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import { SocketProvider } from './SocketContext';

type AppProps = {};

const App: React.FC<AppProps> = () => (
  <SocketProvider>
    <Router>
      <Routes />
    </Router>
  </SocketProvider>
);

export default App;

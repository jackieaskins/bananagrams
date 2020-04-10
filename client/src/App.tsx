import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import { SocketProvider } from './SocketContext';

const App: React.FC<{}> = () => (
  <SocketProvider>
    <Router>
      <Routes />
    </Router>
  </SocketProvider>
);

export default App;

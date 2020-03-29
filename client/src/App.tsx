import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';

type AppProps = {};

const App: React.FC<AppProps> = () => (
  <Router>
    <Routes />
  </Router>
);

export default App;

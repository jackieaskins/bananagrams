import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { GameProvider } from './games/GameContext';
import GameManager from './games/GameManager';
import Home from './Home';
import JoinGame from './games/JoinGame';
import NotFound from './NotFound';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/game/:gameId" exact>
      <GameProvider>
        <GameManager />
      </GameProvider>
    </Route>
    <Route path="/game/:gameId/join" exact component={JoinGame} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;

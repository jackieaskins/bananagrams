import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { GameProvider } from './games/GameContext';
import Game from './games/Game';
import Home from './Home';
import JoinGame from './games/JoinGame';
import NotFound from './NotFound';

type RoutesProps = {};

const Routes: React.FC<RoutesProps> = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/game/:gameId" exact>
      <GameProvider>
        <Game />
      </GameProvider>
    </Route>
    <Route path="/game/:gameId/join" exact component={JoinGame} />
    <Route component={NotFound} />
  </Switch>
);

export default Routes;

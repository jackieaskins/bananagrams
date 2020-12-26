import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import GameManager from './games/GameManager';
import JoinGame from './games/JoinGame';
import SocketGameProvider from './games/SocketGameProvider';

const Routes = (): JSX.Element => (
  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>
    <Route path="/game/:gameId" exact>
      <SocketGameProvider>
        <GameManager />
      </SocketGameProvider>
    </Route>
    <Route path="/game/:gameId/join" exact>
      <JoinGame />
    </Route>
    <Route>
      <NotFound />
    </Route>
  </Switch>
);

export default Routes;

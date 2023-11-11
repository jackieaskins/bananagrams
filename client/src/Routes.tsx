import { Route, Switch } from 'react-router-dom';

import GameManager from './games/GameManager';
import Home from './Home';
import JoinGame from './games/JoinGame';
import NotFound from './NotFound';
import SocketGameProvider from './games/SocketGameProvider';

const Routes: React.FC = () => (
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

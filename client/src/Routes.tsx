import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import JoinGame from './game/JoinGame';

const Routes = (): JSX.Element => (
  <Switch>
    <Route path="/" exact>
      <Home />
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

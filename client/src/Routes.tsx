import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';

type RoutesProps = {};

const Routes: React.FC<RoutesProps> = () => (
  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>

    <Route>
      <NotFound />
    </Route>
  </Switch>
);

export default Routes;

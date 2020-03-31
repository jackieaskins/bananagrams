import React from 'react';

import CreateGameForm from './games/CreateGameForm';
import CenteredLayout from './layouts/CenteredLayout';

const Home: React.FC<{}> = () => (
  <CenteredLayout>
    <h1>Start a new game</h1>

    <CreateGameForm />
  </CenteredLayout>
);

export default Home;

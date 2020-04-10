import React from 'react';
import { match } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import JoinGameForm from './JoinGameForm';

type JoinGameProps = {
  match: match<{ gameId: string }>;
};

const JoinGame: React.FC<JoinGameProps> = ({
  match: {
    params: { gameId },
  },
}) => (
  <CenteredLayout>
    <JoinGameForm gameId={gameId} />
  </CenteredLayout>
);

export default JoinGame;

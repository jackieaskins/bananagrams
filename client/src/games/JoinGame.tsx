import React from 'react';
import { useParams } from 'react-router-dom';

import CenteredLayout from '../layouts/CenteredLayout';
import JoinGameForm from './JoinGameForm';

const JoinGame: React.FC = () => {
  const { gameId } = useParams();

  return (
    <CenteredLayout>
      <JoinGameForm gameId={gameId} />
    </CenteredLayout>
  );
};

export default JoinGame;

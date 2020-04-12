import React from 'react';
import { Box, Button } from '@material-ui/core';
import { Link, match } from 'react-router-dom';

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
    <Box mt={1}>
      <Button
        component={Link}
        fullWidth
        size="large"
        color="secondary"
        to="/"
        variant="contained"
      >
        Go home
      </Button>
    </Box>
  </CenteredLayout>
);

export default JoinGame;

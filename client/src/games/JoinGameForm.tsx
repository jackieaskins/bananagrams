import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import Button from '../buttons/Button';
import ErrorAlert from '../alerts/ErrorAlert';
import TextField from '../forms/TextField';
import { useJoinGameForm } from './JoinGameFormState';

type JoinGameFormProps = {
  gameId: string;
};

const JoinGameForm: React.FC<JoinGameFormProps> = () => {
  const {
    error,
    isJoiningGame,
    onSubmit,
    setUsername,
    username,
  } = useJoinGameForm();

  return (
    <>
      <Typography variant="h3" style={{ marginBottom: '5px' }}>
        Join game
      </Typography>
      <ErrorAlert visible={!!error} style={{ marginBottom: '5px' }}>
        {error}
      </ErrorAlert>
      <Grid
        container
        direction="column"
        spacing={3}
        component="form"
        autoComplete="off"
      >
        <Grid item>
          <TextField
            label="Username"
            name="username"
            required
            value={username}
            setValue={setUsername}
          />
        </Grid>

        <Grid item>
          <Button
            disabled={!username}
            loading={isJoiningGame}
            loadingText="Joining game"
            onClick={onSubmit}
            size="large"
            fullWidth
          >
            Join game
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default JoinGameForm;

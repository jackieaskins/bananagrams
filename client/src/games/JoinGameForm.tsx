import React from 'react';
import { Grid, Link as MUILink, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

import Button from '../buttons/Button';
import ErrorAlert from '../alerts/ErrorAlert';
import TextField from '../forms/TextField';
import { useJoinGameForm } from './JoinGameFormState';

const JoinGameForm: React.FC = () => {
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

        <Grid item style={{ margin: '0 auto', padding: '0' }}>
          <MUILink component={Link} to="/" variant="body1" align="center">
            Go home
          </MUILink>
        </Grid>
      </Grid>
    </>
  );
};

export default JoinGameForm;

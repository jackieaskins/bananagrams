import React from 'react';
import { Grid, Typography } from '@material-ui/core';

import Button from '../buttons/Button';
import ErrorAlert from '../alerts/ErrorAlert';
import TextField from '../forms/TextField';
import { useCreateGameForm } from './CreateGameFormState';

const CreateGameForm: React.FC = () => {
  const {
    error,
    gameName,
    isCreatingGame,
    onSubmit,
    setGameName,
    setUsername,
    username,
  } = useCreateGameForm();

  return (
    <>
      <Typography variant="h3" style={{ marginBottom: '5px' }}>
        Start a new game
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
            label="Game name"
            name="gameName"
            required
            margin="dense"
            value={gameName}
            setValue={setGameName}
          />

          <TextField
            label="Username"
            name="username"
            margin="dense"
            required
            value={username}
            setValue={setUsername}
          />
        </Grid>

        <Grid item>
          <Button
            loading={isCreatingGame}
            loadingText="Creating game"
            disabled={!gameName || !username}
            onClick={onSubmit}
            size="large"
            fullWidth
          >
            Create game
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateGameForm;

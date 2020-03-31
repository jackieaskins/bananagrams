import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import Button from '../buttons/Button';
import InputField from '../forms/InputField';
import { useCreateGameForm } from './CreateGameFormState';

const CreateGameForm: React.FC<{}> = () => {
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
    <Form>
      <Alert variant="danger" show={!!error}>
        {error}
      </Alert>

      <InputField
        label="Game name"
        name="gameName"
        value={gameName}
        setValue={setGameName}
      />

      <InputField
        label="Username"
        name="username"
        value={username}
        setValue={setUsername}
      />

      <Button
        loading={isCreatingGame}
        loadingText="Creating game"
        disabled={!gameName || !username}
        onClick={onSubmit}
      >
        Create game
      </Button>
    </Form>
  );
};

export default CreateGameForm;

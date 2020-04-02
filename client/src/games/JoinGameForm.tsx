import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import Button from '../buttons/Button';
import InputField from '../forms/InputField';
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
    <Form>
      <Alert variant="danger" show={!!error}>
        {error}
      </Alert>

      <InputField
        label="Username"
        name="username"
        value={username}
        setValue={setUsername}
      />

      <Button
        disabled={!username}
        loading={isJoiningGame}
        loadingText="Joining game"
        onClick={onSubmit}
      >
        Join game
      </Button>
    </Form>
  );
};

export default JoinGameForm;

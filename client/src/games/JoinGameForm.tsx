import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

import Button from '../buttons/Button';
import InputField from '../forms/InputField';
import { GameId } from '../SocketContext';
import { useJoinGameForm } from './JoinGameFormState';

type JoinGameFormProps = {
  gameId: GameId;
};

const JoinGameForm: React.FC<JoinGameFormProps> = ({ gameId }) => {
  const {
    error,
    isJoiningGame,
    onSubmit,
    setUsername,
    username,
  } = useJoinGameForm({
    gameId,
  });

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

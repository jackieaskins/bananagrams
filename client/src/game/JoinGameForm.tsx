import { Form as AntForm, Input, Button } from 'antd';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Form, { SubmitFormFn } from '../form/Form';
import { GameInfo, GameLocationState } from '../games/types';
import { useSocket } from '../socket/SocketContext';

const FormItem = AntForm.Item;

type FormValues = {
  gameId: string;
  username: string;
};

type JoinGameFormProps = {
  gameId: string;
  showGameIdField?: boolean;
};

const JoinGameForm = ({
  gameId,
  showGameIdField = true,
}: JoinGameFormProps): JSX.Element => {
  const { socket } = useSocket();
  const { push } = useHistory();

  const handleSubmit: SubmitFormFn<FormValues> = useCallback(
    (setError) => ({ gameId, username }) => {
      socket.emit(
        'joinGame',
        { gameId, username },
        (error: Error, gameInfo: GameInfo) => {
          if (error) {
            setError(error.message);
          } else {
            const locationState: GameLocationState = {
              isInGame: true,
              gameInfo,
            };

            push(`/game/${gameId}`, locationState);
          }
        }
      );
    },
    [push, socket]
  );

  return (
    <Form
      labelCol={{ span: 5 }}
      onSubmit={handleSubmit}
      initialValues={{ gameId }}
    >
      <FormItem
        hidden={!showGameIdField}
        label="Game id"
        name="gameId"
        rules={[{ required: true }]}
      >
        <Input />
      </FormItem>

      <FormItem label="Username" name="username" rules={[{ required: true }]}>
        <Input />
      </FormItem>

      <FormItem>
        <Button type="primary" htmlType="submit" block>
          Join game
        </Button>
      </FormItem>
    </Form>
  );
};

export default JoinGameForm;

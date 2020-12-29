import { Button, Form as AntForm, Input } from 'antd';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Form, { SubmitFormFn } from '../form/Form';
import { GameInfo, GameLocationState } from '../games/types';
import { useSocket } from '../socket/SocketContext';

const FormItem = AntForm.Item;

type FormValues = {
  gameName: string;
  username: string;
};

type CreateGameFormProps = {
  isShortenedGame?: boolean;
};

const CreateGameForm = ({
  isShortenedGame = false,
}: CreateGameFormProps): JSX.Element => {
  const { socket } = useSocket();
  const { push } = useHistory();

  const handleSubmit: SubmitFormFn<FormValues> = useCallback(
    (setError) => ({ gameName, username }) => {
      socket.emit(
        'createGame',
        { gameName, username, isShortenedGame },
        (error: Error, gameInfo: GameInfo) => {
          if (error) {
            setError(error.message);
          } else {
            const locationState: GameLocationState = {
              isInGame: true,
              gameInfo,
            };

            push(`/game/${gameInfo.gameId}`, locationState);
          }
        }
      );
    },
    [isShortenedGame, push, socket]
  );

  return (
    <Form labelCol={{ span: 5 }} onSubmit={handleSubmit}>
      <FormItem label="Game name" name="gameName" rules={[{ required: true }]}>
        <Input />
      </FormItem>

      <FormItem label="Username" name="username" rules={[{ required: true }]}>
        <Input />
      </FormItem>

      <FormItem>
        <Button type="primary" htmlType="submit" block>
          Create game
        </Button>
      </FormItem>
    </Form>
  );
};

export default CreateGameForm;

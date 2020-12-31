import { Button, Form as AntForm, Input } from 'antd';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Form, { SubmitFormFn } from '../form/Form';
import { useFocusRef } from '../form/inputRef';
import { GameLocationState } from '../games/types';
import { createGame } from '../socket';

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
  const focusRef = useFocusRef();
  const { push } = useHistory();

  const handleSubmit: SubmitFormFn<FormValues> = useCallback(
    (setError) => ({ gameName, username }) => {
      createGame({ gameName, username, isShortenedGame }, (error, gameInfo) => {
        if (error) {
          setError(error.message);
        } else {
          const locationState: GameLocationState = {
            gameInfo,
          };

          push(`/game/${gameInfo.gameId}`, locationState);
        }
      });
    },
    [isShortenedGame, push]
  );

  return (
    <Form labelCol={{ span: 5 }} onSubmit={handleSubmit}>
      <FormItem label="Game name" name="gameName" rules={[{ required: true }]}>
        <Input ref={focusRef} />
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

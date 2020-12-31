import { Form as AntForm, Input, Button } from 'antd';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Form, { SubmitFormFn } from '../form/Form';
import { useFocusRef } from '../form/inputRef';
import { GameLocationState } from '../games/types';
import { joinGame } from '../socket';

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
  const focusRef = useFocusRef();
  const { push } = useHistory();

  const handleSubmit: SubmitFormFn<FormValues> = useCallback(
    (setError) => ({ gameId, username }) => {
      joinGame({ gameId, username }, (error, gameInfo) => {
        if (error) {
          setError(error.message);
        } else {
          const locationState: GameLocationState = {
            gameInfo,
          };

          push(`/game/${gameId}`, locationState);
        }
      });
    },
    [push]
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
        <Input ref={focusRef} />
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

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import JoinGameForm from './JoinGameForm';

jest.mock('./JoinGameFormState', () => ({
  useJoinGameForm: jest.fn().mockReturnValue({
    error: 'Error',
    isJoiningGame: false,
    onSubmit: jest.fn().mockName('onSubmit'),
    setUsername: jest.fn().mockName('setUsername'),
    uesrname: 'username',
  }),
}));

describe('JoinGameForm', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<JoinGameForm gameId="gameId" />)).toMatchSnapshot();
  });
});

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import CreateGameForm from './CreateGameForm';

jest.mock('./CreateGameFormState', () => ({
  useCreateGameForm: jest.fn().mockReturnValue({
    error: 'Error',
    gameName: 'gameName',
    isCreatingGame: false,
    onSubmit: jest.fn().mockName('onSubmit'),
    setGameName: jest.fn().mockName('setGameName'),
    setUsername: jest.fn().mockName('setUsername'),
    username: 'username',
  }),
}));

describe('CreateGameForm', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<CreateGameForm />)).toMatchSnapshot();
  });
});

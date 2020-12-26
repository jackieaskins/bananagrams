import { shallow } from 'enzyme';

import CreateGameForm from './CreateGameForm';

jest.mock('./CreateGameFormState', () => ({
  useCreateGameForm: () => ({
    error: 'error',
    gameName: 'gameName',
    isCreatingGame: true,
    onSubmit: jest.fn().mockName('onSubmit'),
    setGameName: jest.fn().mockName('setGameName'),
    setUsername: jest.fn().mockName('setUsername'),
    username: 'username',
  }),
}));

describe('<CreateGameForm />', () => {
  test('renders properly', () => {
    expect(shallow(<CreateGameForm />)).toMatchSnapshot();
  });
});

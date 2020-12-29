import { shallow } from 'enzyme';

import Form, { FormProps } from '../form/Form';
import { getEmptyGameInfo } from '../games/GameContext';
import CreateGameForm from './CreateGameForm';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

const mockEmit = jest.fn();
jest.mock('../socket/SocketContext', () => ({
  useSocket: () => ({
    socket: {
      emit: mockEmit,
    },
  }),
}));

const mockSetError = jest.fn();

describe('<CreateGameForm />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<CreateGameForm {...propOverrides} />);

  test('renders form with fields', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('handleSubmit', () => {
    const gameId = 'gameId';
    const values = { gameName: 'gameName', username: 'username' };
    const gameInfo = getEmptyGameInfo(gameId);
    const submitCallback = (error: { message: string } | null) =>
      mockEmit.mock.calls[0][2](error, gameInfo);

    beforeEach(() => {
      (renderComponent().find(Form).props() as FormProps<
        typeof values
      >).onSubmit(mockSetError)(values);
    });

    test('emits join game event', () => {
      expect(mockEmit).toHaveBeenCalledWith(
        'createGame',
        { ...values, isShortenedGame: false },
        expect.any(Function)
      );
    });

    test('sets error on error', () => {
      const message = 'error';
      submitCallback({ message });

      expect(mockSetError).toHaveBeenCalledWith(message);
    });

    test('redirects to game with state', () => {
      submitCallback(null);

      expect(mockPush).toHaveBeenCalledWith('/game/gameId', {
        isInGame: true,
        gameInfo,
      });
    });
  });
});

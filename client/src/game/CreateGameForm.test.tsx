import { shallow } from 'enzyme';

import { gameInfoFixture } from '../fixtures/game';
import Form, { FormProps } from '../form/Form';
import { createGame } from '../socket';
import CreateGameForm from './CreateGameForm';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock('../socket', () => ({
  createGame: jest.fn(),
}));

const mockCreateGame = createGame as jest.Mock;

const mockSetError = jest.fn();
describe('<CreateGameForm />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<CreateGameForm {...propOverrides} />);

  it('renders form with fields', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('handleSubmit', () => {
    const values = { gameName: 'gameName', username: 'username' };
    const gameInfo = gameInfoFixture();
    const submitCallback = (error: { message: string } | null) =>
      mockCreateGame.mock.calls[0][1](error, gameInfo);

    beforeEach(() => {
      (renderComponent().find(Form).props() as FormProps<
        typeof values
      >).onSubmit(mockSetError)(values);
    });

    it('emits join game event', () => {
      expect(mockCreateGame).toHaveBeenCalledWith(
        { ...values, isShortenedGame: false },
        expect.any(Function)
      );
    });

    it('sets error on error', () => {
      const message = 'error';
      submitCallback({ message });

      expect(mockSetError).toHaveBeenCalledWith(message);
    });

    it('redirects to game with state', () => {
      submitCallback(null);

      expect(mockPush).toHaveBeenCalledWith('/game/gameId', {
        gameInfo,
      });
    });
  });
});

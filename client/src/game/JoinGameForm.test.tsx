import { shallow } from 'enzyme';

import Form, { FormProps } from '../form/Form';
import { getEmptyGameInfo } from '../games/GameContext';
import { joinGame } from '../socket';
import JoinGameForm from './JoinGameForm';

const mockPush = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockPush,
  }),
}));

jest.mock('../socket', () => ({
  joinGame: jest.fn(),
}));

const mockJoinGame = joinGame as jest.Mock;
const mockSetError = jest.fn();
describe('<JoinGameForm />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<JoinGameForm gameId="gameId" {...propOverrides} />);

  it('renders form with fields', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('handleSubmit', () => {
    const gameId = 'gameId';
    const values = { gameId, username: 'username' };
    const gameInfo = getEmptyGameInfo(gameId);
    const submitCallback = (error: { message: string } | null) =>
      mockJoinGame.mock.calls[0][1](error, gameInfo);

    beforeEach(() => {
      (renderComponent().find(Form).props() as FormProps<
        typeof values
      >).onSubmit(mockSetError)(values);
    });

    it('emits join game event', () => {
      expect(mockJoinGame).toHaveBeenCalledWith(values, expect.any(Function));
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

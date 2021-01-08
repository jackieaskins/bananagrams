import { Button } from 'antd';
import { shallow } from 'enzyme';

import { isValidConnectedBoard } from '../boards/validate';
import { playerFixture } from '../fixtures/player';
import {
  useCurrentBoard,
  useCurrentHand,
  useGameBunch,
  useGamePlayers,
} from '../game/stateHooks';
import PeelButton from './PeelButton';

const mockIsValidConnectedBoard = isValidConnectedBoard as jest.Mock;
jest.mock('../boards/validate', () => ({
  isValidConnectedBoard: jest.fn(),
}));

const mockUseCurrentHand = useCurrentHand as jest.Mock;
const mockUseCurrentBoard = useCurrentBoard as jest.Mock;
const mockUseGameBunch = useGameBunch as jest.Mock;
const mockUseGamePlayers = useGamePlayers as jest.Mock;
jest.mock('../game/stateHooks', () => ({
  useCurrentBoard: jest.fn(),
  useCurrentHand: jest.fn(),
  useGameBunch: jest.fn(),
  useGamePlayers: jest.fn(),
}));

jest.mock('../socket', () => ({
  peel: jest.fn().mockName('peel'),
}));

const tile = { letter: 'A', id: 'A1' };
describe('<PeelButton />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<PeelButton {...propOverrides} />);

  beforeEach(() => {
    mockUseCurrentHand.mockReturnValue([]);
    mockUseCurrentBoard.mockReturnValue({});
    mockUseGameBunch.mockReturnValue([]);
    mockUseGamePlayers.mockReturnValue([playerFixture()]);

    mockIsValidConnectedBoard.mockReturnValue(false);
  });

  it('renders button', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe('disabled', () => {
    const isButtonDisabled = () =>
      renderComponent().find(Button).props().disabled;

    it('is enabled if hand is empty and board is valid', () => {
      mockIsValidConnectedBoard.mockReturnValue(true);

      expect(isButtonDisabled()).toEqual(false);
    });

    it('is disabled if hand is not empty', () => {
      mockUseCurrentHand.mockReturnValue([tile]);
      mockIsValidConnectedBoard.mockReturnValue(true);

      expect(isButtonDisabled()).toEqual(true);
    });

    it('is disabled if board is not valid', () => {
      mockIsValidConnectedBoard.mockReturnValue(false);

      expect(isButtonDisabled()).toEqual(true);
    });
  });

  describe('button text', () => {
    const getButtonText = () => renderComponent().find(Button).props().children;

    it('shows bananas if there are fewer tiles in the bunch than players', () => {
      expect(getButtonText()).toEqual('Bananas');
    });

    it('shows peel if there are still enough tiles', () => {
      mockUseGameBunch.mockReturnValue([tile, tile, tile, tile]);

      expect(getButtonText()).toEqual('Peel');
    });
  });

  describe('tooltip text', () => {
    const getTooltipText = () => renderComponent().props().title;

    it('shows invalid board message if cannot peel', () => {
      mockIsValidConnectedBoard.mockReturnValue(false);

      expect(getTooltipText()).toMatchSnapshot();
    });

    it('shows win game message if peel wins game', () => {
      mockIsValidConnectedBoard.mockReturnValue(true);

      expect(getTooltipText()).toMatchSnapshot();
    });

    it('shows default message otherwise', () => {
      mockIsValidConnectedBoard.mockReturnValue(true);
      mockUseGameBunch.mockReturnValue([tile, tile, tile, tile]);

      expect(getTooltipText()).toMatchSnapshot();
    });
  });
});

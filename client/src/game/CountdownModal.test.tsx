import { shallow } from 'enzyme';

import CountdownModal from './CountdownModal';
import { useGameStatus } from './stateHooks';

const mockUseGameStatus = useGameStatus as jest.Mock;
jest.mock('./stateHooks', () => ({
  useGameCountdown: jest.fn(),
  useGameStatus: jest.fn(),
}));

describe('<CountdownModal />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<CountdownModal {...propOverrides} />);

  test('renders modal as visible when game is starting', () => {
    mockUseGameStatus.mockReturnValue('STARTING');

    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders modal as not visible when game is not starting', () => {
    mockUseGameStatus.mockReturnValue('NOT_STARTED');

    expect(renderComponent()).toMatchSnapshot();
  });
});

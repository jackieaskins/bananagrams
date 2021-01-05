import { shallow } from 'enzyme';

import WaitingRoom from './WaitingRoom';

jest.mock('./stateHooks', () => ({
  useGameName: jest.fn().mockReturnValue('gameName'),
}));

describe('<WaitingRoom />', () => {
  it('renders properly', () => {
    expect(shallow(<WaitingRoom />)).toMatchSnapshot();
  });
});
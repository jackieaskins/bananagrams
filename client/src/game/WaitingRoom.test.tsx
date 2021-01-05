import { shallow } from 'enzyme';

import WaitingRoom from './WaitingRoom';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ gameId: 'gameId' }),
}));

jest.mock('./stateHooks', () => ({
  useGameName: jest.fn().mockReturnValue('gameName'),
}));

describe('<WaitingRoom />', () => {
  it('renders properly', () => {
    expect(shallow(<WaitingRoom />)).toMatchSnapshot();
  });
});

import { shallow } from 'enzyme';

import JoinGame from './JoinGame';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual<any>('react-router-dom'),
  useParams: jest.fn().mockReturnValue({ gameId: 'gameId' }),
}));

describe('<JoinGame />', () => {
  test('renders centered join game form', () => {
    expect(shallow(<JoinGame />)).toMatchSnapshot();
  });
});

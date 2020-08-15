import React from 'react';
import { shallow } from 'enzyme';
import JoinGame from './JoinGame';

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    gameId: 'gameId',
  }),
}));

describe('<JoinGame />', () => {
  test('renders properly', () => {
    expect(shallow(<JoinGame />)).toMatchSnapshot();
  });
});

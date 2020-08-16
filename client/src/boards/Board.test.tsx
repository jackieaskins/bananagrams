import React from 'react';
import { shallow } from 'enzyme';
import { boardSquareFixture } from '../fixtures/board';
import Board from './Board';

describe('<Board />', () => {
  test('renders properly', () => {
    const board = [
      [boardSquareFixture(), null],
      [null, null],
    ];

    expect(shallow(<Board board={board} />)).toMatchSnapshot();
  });
});

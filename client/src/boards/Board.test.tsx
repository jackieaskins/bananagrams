import { shallow } from 'enzyme';
import React from 'react';

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

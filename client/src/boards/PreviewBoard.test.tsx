import React from 'react';
import { shallow } from 'enzyme';
import { boardSquareFixture } from '../fixtures/board';
import PreviewBoard from './PreviewBoard';

describe('<PreviewBoard />', () => {
  test('renders properly', () => {
    expect(
      shallow(
        <PreviewBoard
          board={[
            [boardSquareFixture(), null],
            [null, null],
          ]}
          tileSize={23}
        />
      )
    ).toMatchSnapshot();
  });
});

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Home from './Home';

describe('Home', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<Home />)).toMatchSnapshot();
  });
});

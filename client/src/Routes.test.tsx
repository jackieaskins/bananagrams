import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Routes from './Routes';

describe('Routes', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<Routes />)).toMatchSnapshot();
  });
});

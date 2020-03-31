import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import NotFound from './NotFound';

describe('NotFound', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<NotFound />)).toMatchSnapshot();
  });
});

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import App from './App';

describe('App', () => {
  const renderer = ShallowRenderer.createRenderer();

  test('renders properly', () => {
    expect(renderer.render(<App />)).toMatchSnapshot();
  });
});

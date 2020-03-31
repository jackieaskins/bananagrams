import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import LoadingIndicator from './LoadingIndicator';

describe('LoadingIndicator', () => {
  const renderer = ShallowRenderer.createRenderer();

  const renderComponent = (props = {}) =>
    renderer.render(<LoadingIndicator {...props} />);

  test('renders properly with loading text', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly without loading text', () => {
    expect(renderComponent({ loadingText: 'Loading' })).toMatchSnapshot();
  });

  test('renders properly with size', () => {
    expect(renderComponent({ size: 'sm' })).toMatchSnapshot();
  });
});

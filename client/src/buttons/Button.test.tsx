import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import Button from './Button';

describe('Button', () => {
  const renderer = ShallowRenderer.createRenderer();

  const renderComponent = (propOverrides = {}) => {
    const props = {
      children: 'Button text',
      disabled: false,
      loading: false,
      loadingText: 'Loading',
      onClick: jest.fn().mockName('onClick'),
      ...propOverrides,
    };

    return renderer.render(<Button {...props} />);
  };

  test('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly when loading', () => {
    expect(renderComponent({ loading: true })).toMatchSnapshot();
  });
});

import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import InputField from './InputField';

const mockSetValue = jest.fn().mockName('setValue');

describe('InputField', () => {
  const renderer = ShallowRenderer.createRenderer();

  const renderComponent = (propOverrides = {}) => {
    const props = {
      name: 'name',
      setValue: mockSetValue,
      value: 'value',
      ...propOverrides,
    };

    return renderer.render(<InputField {...props} />);
  };

  const getComponent = () => renderer.getRenderOutput();

  test('renders properly without label', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders properly with label', () => {
    expect(renderComponent({ label: 'label' })).toMatchSnapshot();
  });

  test('onChange calls setValue', () => {
    const value = 'newValue';
    getComponent().props.children[1].props.onChange({ target: { value } });

    expect(mockSetValue).toHaveBeenCalledWith(value);
  });
});

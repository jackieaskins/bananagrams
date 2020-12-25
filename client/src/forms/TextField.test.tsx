import { shallow } from 'enzyme';
import React from 'react';

import TextField from './TextField';

describe('<TextField />', () => {
  const mockSetValue = jest.fn();

  const renderComponent = () =>
    shallow(<TextField setValue={mockSetValue} value="value" />);

  test('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('onChange calls setValue', () => {
    renderComponent()
      .props()
      .onChange({ target: { value: 'newValue' } });

    expect(mockSetValue).toHaveBeenCalledWith('newValue');
  });
});

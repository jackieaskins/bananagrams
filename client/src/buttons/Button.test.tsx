import React from 'react';
import { shallow } from 'enzyme';
import Button from './Button';

describe('<Button />', () => {
  const renderButton = (propOverrides = {}) =>
    shallow(
      <Button onClick={jest.fn().mockName('onClick')} {...propOverrides}>
        Button
      </Button>
    );

  test('renders properly while loading', () => {
    expect(
      renderButton({ loadingText: 'Loading', loading: true })
    ).toMatchSnapshot();
  });

  test('renders properly when disabled', () => {
    expect(renderButton({ disabled: true })).toMatchSnapshot();
  });
});

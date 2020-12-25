import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';

import NotFound from './NotFound';
import Routes from './Routes';

describe('<Routes />', () => {
  const renderComponent = (): ShallowWrapper => shallow(<Routes />);

  test('renders correct routes', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders NotFound as last route', () => {
    expect(renderComponent().children().last().children().type()).toEqual(
      NotFound
    );
  });
});

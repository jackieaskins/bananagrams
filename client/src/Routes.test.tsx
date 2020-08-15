import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import Routes from './Routes';

import NotFound from './NotFound';

describe('<Routes />', () => {
  const renderRoutes = (): ShallowWrapper => shallow(<Routes />);

  test('renders correct routes', () => {
    expect(renderRoutes()).toMatchSnapshot();
  });

  test('renders NotFound as last route', () => {
    expect(renderRoutes().children().last().children().type()).toEqual(
      NotFound
    );
  });
});

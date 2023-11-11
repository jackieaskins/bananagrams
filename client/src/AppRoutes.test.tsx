import { shallow, ShallowWrapper } from 'enzyme';

import AppRoutes from './AppRoutes';

describe('<AppRoutes />', () => {
  const renderComponent = (): ShallowWrapper => shallow(<AppRoutes />);

  test('renders correct routes', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  test('renders NotFound as last route', () => {
    expect(renderComponent().children().last().props().path).toBe('*');
  });
});

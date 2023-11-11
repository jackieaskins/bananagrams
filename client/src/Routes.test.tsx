import { shallow, ShallowWrapper } from 'enzyme';
import Routes from './Routes';

import NotFound from './NotFound';

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

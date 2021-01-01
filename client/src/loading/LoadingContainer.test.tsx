import { shallow } from 'enzyme';

import LoadingContainer from './LoadingContainer';

describe('<LoadingContainer />', () => {
  const renderComponent = (propOverrides = {}) =>
    shallow(<LoadingContainer {...propOverrides} />);

  test('renders centered spinner', () => {
    expect(renderComponent()).toMatchSnapshot();
  });
});

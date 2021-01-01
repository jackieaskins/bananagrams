import { shallow } from 'enzyme';

import TextField from './TextField';

describe('<TextField />', () => {
  const mockSetValue = jest.fn();

  const renderComponent = () =>
    shallow(<TextField setValue={mockSetValue} value="value" />);

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  it('onChange calls setValue', () => {
    renderComponent()
      .props()
      .onChange({ target: { value: 'newValue' } });

    expect(mockSetValue).toHaveBeenCalledWith('newValue');
  });
});

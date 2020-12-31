import { shallow } from 'enzyme';

import App from './App';
import { disconnect } from './socket';

jest.mock('react', () => ({
  ...jest.requireActual<any>('react'),
  useEffect: jest.fn().mockImplementation((f) => f()()),
}));

jest.mock('./socket', () => ({
  disconnect: jest.fn(),
}));

describe('<App />', () => {
  test('renders properly', () => {
    expect(shallow(<App />)).toMatchSnapshot();
  });

  test('calls disconnect on dismount', () => {
    shallow(<App />);

    expect(disconnect).toHaveBeenCalledWith();
  });
});

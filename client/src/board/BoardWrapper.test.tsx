import { shallow } from 'enzyme';

import { useWindowSize, WindowSize } from '../util/window';
import BoardWrapper from './BoardWrapper';

jest.mock('./constants');
jest.mock('../util/window');

describe('<BoardWrapper />', () => {
  const mockUseWindowSizeFn = (rv: WindowSize): void => {
    (useWindowSize as jest.Mock).mockReturnValue(rv);
  };

  it('renders part of board offscreen when board is larger than window', () => {
    mockUseWindowSizeFn({
      width: 25,
      height: 25,
    });
    expect(shallow(<BoardWrapper />)).toMatchSnapshot();
  });

  it('renders board onscreen when board is smaller than window', () => {
    mockUseWindowSizeFn({
      width: 75,
      height: 75,
    });
    expect(shallow(<BoardWrapper />)).toMatchSnapshot();
  });
});

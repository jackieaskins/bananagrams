import { DialogProps, FormControlLabel, Button } from '@material-ui/core';
import { shallow, ShallowWrapper } from 'enzyme';

import WalkthroughDialog from './WalkthroughDialog';
import { WalkthroughDialogState } from './WalkthroughDialogState';


const mockHandleClose = jest.fn().mockName('handleClose');
const mockSetAskAgain = jest.fn().mockName('setAskAgain');
jest.mock('./WalkthroughDialogState', () => ({
  useWalkthroughDialog: (): WalkthroughDialogState => ({
    askAgain: false,
    handleClose: mockHandleClose,
    setAskAgain: mockSetAskAgain,
    shouldShowWalkthroughDialog: true,
  }),
}));

describe('<WalkthroughDialog />', () => {
  const mockShowWalkthrough = jest.fn().mockName('showWalkthrough');
  const renderComponent = (): ShallowWrapper<DialogProps> =>
    shallow(<WalkthroughDialog showWalkthrough={mockShowWalkthrough} />);

  it('renders properly', () => {
    expect(renderComponent()).toMatchSnapshot();
  });

  describe("don't ask again checkbox", () => {
    it('calls setAskAgain with negated checked on change', () => {
      shallow(renderComponent().find(FormControlLabel).props().control)
        .props()
        .onChange?.({ target: { checked: false } });

      expect(mockSetAskAgain).toHaveBeenCalledWith(true);
    });
  });

  describe('Yes button', () => {
    beforeEach(() => {
      renderComponent()
        .find(Button)
        .find({ children: 'Yes' })
        .props()
        .onClick();
    });

    it('shows the walkthrough', () => {
      expect(mockShowWalkthrough).toHaveBeenCalledWith();
    });

    it('closes the dialog', () => {
      expect(mockHandleClose).toHaveBeenCalledWith();
    });
  });
});

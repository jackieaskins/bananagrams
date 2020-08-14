import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import WalkthroughDialog from './WalkthroughDialog';
import { WalkthroughDialogState } from './WalkthroughDialogState';
import { DialogProps, FormControlLabel, Button } from '@material-ui/core';

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
  let dialog: ShallowWrapper<DialogProps>;

  const mockShowWalkthrough = jest.fn().mockName('showWalkthrough');
  const renderDialog = (): ShallowWrapper<DialogProps> => {
    dialog = shallow(
      <WalkthroughDialog showWalkthrough={mockShowWalkthrough} />
    );
    return dialog;
  };

  test('renders properly', () => {
    expect(renderDialog()).toMatchSnapshot();
  });

  describe("don't ask again checkbox", () => {
    test('calls setAskAgain with negated checked on change', () => {
      shallow(renderDialog().find(FormControlLabel).props().control)
        .props()
        .onChange?.({ target: { checked: false } });

      expect(mockSetAskAgain).toHaveBeenCalledWith(true);
    });
  });

  describe('Yes button', () => {
    beforeEach(() => {
      renderDialog().find(Button).find({ children: 'Yes' }).props().onClick();
    });

    test('shows the walkthrough', () => {
      expect(mockShowWalkthrough).toHaveBeenCalledWith();
    });

    test('closes the dialog', () => {
      expect(mockHandleClose).toHaveBeenCalledWith();
    });
  });
});

import { useState } from 'react';
import { get, set } from 'local-storage';
import { SetState } from '../state/types';

export const SHOW_WALKTHROUGH_KEY = 'showWalkthrough';

export type WalkthroughDialogState = {
  askAgain: boolean;
  handleClose: () => void;
  setAskAgain: SetState<boolean>;
  shouldShowWalkthroughDialog: boolean;
};
export const useWalkthroughDialog = (): WalkthroughDialogState => {
  const [askAgain, setAskAgain] = useState(false);
  const [
    shouldShowWalkthroughDialog,
    setShouldShowWalkthroughDialog,
  ] = useState(get<boolean | undefined>(SHOW_WALKTHROUGH_KEY) ?? true);

  const handleClose = (): void => {
    set<boolean>(SHOW_WALKTHROUGH_KEY, askAgain);
    setShouldShowWalkthroughDialog(false);
  };

  return {
    askAgain,
    handleClose,
    setAskAgain,
    shouldShowWalkthroughDialog,
  };
};

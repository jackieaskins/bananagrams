import { set, get } from 'local-storage';
import { useState } from 'react';

import { testHook } from '../testUtils';
import { useWalkthroughDialog } from './WalkthroughDialogState';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
}));

jest.mock('local-storage', () => ({
  set: jest.fn(),
  get: jest.fn(),
}));

describe('useWalkthroughDialog', () => {
  const mockSetAskAgain = jest.fn();
  const mockSetShouldShowWalkthroughDialog = jest.fn();

  beforeEach(() => {
    useState
      .mockImplementationOnce((initialState) => [initialState, mockSetAskAgain])
      .mockImplementationOnce((initialState) => [
        initialState,
        mockSetShouldShowWalkthroughDialog,
      ]);
  });

  const getState = (): any => {
    let state;

    testHook(() => {
      state = useWalkthroughDialog();
    });

    return state;
  };

  it('has correct default values', () => {
    expect(getState()).toMatchSnapshot();
  });

  describe('handleClose', () => {
    beforeEach(() => {
      getState().handleClose();
    });

    it('updates show walkthrough in local storage', () => {
      expect(set).toHaveBeenCalledWith('showWalkthrough', false);
    });

    it('hides dialog', () => {
      expect(mockSetShouldShowWalkthroughDialog).toHaveBeenCalledWith(false);
    });
  });

  describe('shouldShowWalkthroughDialog', () => {
    it('shows dialog when key is not in local storage', () => {
      get.mockReturnValue(undefined);
      expect(getState().shouldShowWalkthroughDialog).toEqual(true);
    });

    it('shows dialog when key is set to true', () => {
      get.mockReturnValue(true);
      expect(getState().shouldShowWalkthroughDialog).toEqual(true);
    });

    it('does not show dialog when key is set to false', () => {
      get.mockReturnValue(false);
      expect(getState().shouldShowWalkthroughDialog).toEqual(false);
    });
  });
});

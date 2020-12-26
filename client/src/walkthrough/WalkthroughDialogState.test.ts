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

  test('has correct default values', () => {
    expect(getState()).toMatchSnapshot();
  });

  describe('handleClose', () => {
    beforeEach(() => {
      getState().handleClose();
    });

    test('updates show walkthrough in local storage', () => {
      expect(set).toHaveBeenCalledWith('showWalkthrough', false);
    });

    test('hides dialog', () => {
      expect(mockSetShouldShowWalkthroughDialog).toHaveBeenCalledWith(false);
    });
  });

  describe('shouldShowWalkthroughDialog', () => {
    test('shows dialog when key is not in local storage', () => {
      get.mockReturnValue(undefined);
      expect(getState().shouldShowWalkthroughDialog).toEqual(true);
    });

    test('shows dialog when key is set to true', () => {
      get.mockReturnValue(true);
      expect(getState().shouldShowWalkthroughDialog).toEqual(true);
    });

    test('does not show dialog when key is set to false', () => {
      get.mockReturnValue(false);
      expect(getState().shouldShowWalkthroughDialog).toEqual(false);
    });
  });
});

import { useGameSpeedDial } from './GameSpeedDialState';

const mockSetLeaveGameDialogOpen = jest.fn();
jest.mock('react', () => ({
  useState: jest
    .fn()
    .mockImplementation((initialValue) => [
      initialValue,
      mockSetLeaveGameDialogOpen,
    ]),
}));

describe('useGameSpeedDial', () => {
  test('starts dialog as closed', () => {
    expect(useGameSpeedDial().leaveGameDialogOpen).toBe(false);
  });

  test('opens dialog on showLeaveGameDialog', () => {
    useGameSpeedDial().showLeaveGameDialog();

    expect(mockSetLeaveGameDialogOpen).toHaveBeenCalledWith(true);
  });

  test('hides dialog on handleLeaveGameCancel', () => {
    useGameSpeedDial().handleLeaveGameCancel();

    expect(mockSetLeaveGameDialogOpen).toHaveBeenCalledWith(false);
  });
});

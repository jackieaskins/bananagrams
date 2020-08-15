import { useGameSidebar } from './GameSidebarState';

const mockSetLeaveGameDialogOpen = jest.fn();
jest.mock('react', () => ({
  useState: jest
    .fn()
    .mockImplementation((initialValue) => [
      initialValue,
      mockSetLeaveGameDialogOpen,
    ]),
}));

describe('useGameSidebar', () => {
  test('starts dialog as closed', () => {
    expect(useGameSidebar().leaveGameDialogOpen).toEqual(false);
  });

  test('opens dialog on showLeaveGameDialog', () => {
    useGameSidebar().showLeaveGameDialog();

    expect(mockSetLeaveGameDialogOpen).toHaveBeenCalledWith(true);
  });

  test('hides dialog on handleLeaveGameCancel', () => {
    useGameSidebar().handleLeaveGameCancel();

    expect(mockSetLeaveGameDialogOpen).toHaveBeenCalledWith(false);
  });
});

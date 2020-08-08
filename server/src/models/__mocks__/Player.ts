export default jest.fn().mockImplementation((userId, username) => ({
  getUserId: jest.fn().mockReturnValue(userId),
  getUsername: jest.fn().mockReturnValue(username),
  toJSON: jest.fn().mockReturnValue('PlayerJSON'),
  reset: jest.fn(),
}));

export default jest.fn().mockImplementation(() => ({
  toJSON: jest.fn().mockReturnValue('BunchJSON'),
  reset: jest.fn(),
}));

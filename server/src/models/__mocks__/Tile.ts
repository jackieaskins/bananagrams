export default jest.fn().mockImplementation((id, letter) => ({
  getId: jest.fn().mockReturnValue(id),
  getLetter: jest.fn().mockReturnValue(letter),
  toJSON: jest.fn().mockReturnValue(`TileJSON - ${id} ${letter}`),
}));

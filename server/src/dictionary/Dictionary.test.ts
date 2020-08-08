import Dictionary from './Dictionary';

jest.mock('./words', () => ['hello', 'goodbye']);

describe('Dictionary', () => {
  test('isWord returns true for words in dictionary', () => {
    expect(Dictionary.isWord('hello')).toEqual(true);
    expect(Dictionary.isWord('goodbye')).toEqual(true);
  });

  test('isWord returns false for words not in dictionary', () => {
    expect(Dictionary.isWord('hi')).toEqual(false);
  });
});

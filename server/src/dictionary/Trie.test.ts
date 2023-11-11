import Trie from "./Trie";

describe("Trie", () => {
  let trie: Trie;
  const validWords = ["tools", "too", "fool", "hello"];
  const invalidWords = ["tool", "fools", "goodbye"];

  beforeEach(() => {
    trie = new Trie();
    validWords.forEach((word) => trie.insert(word));
  });

  test("search returns true for words in trie", () => {
    validWords.forEach((word) => expect(trie.search(word)).toBe(true));
  });

  test("search returns false for words not in trie", () => {
    invalidWords.forEach((word) => expect(trie.search(word)).toBe(false));
  });
});

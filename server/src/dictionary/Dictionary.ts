import Trie from "./Trie";
import words from "./words";

export default class Dictionary {
  static trie: Trie;

  static initialize(): void {
    this.trie = new Trie();

    words.forEach((word) => {
      this.trie.insert(word.trim());
    });
  }

  static isWord(word: string): boolean {
    if (!this.trie) {
      this.initialize();
    }

    return this.trie.search(word);
  }
}

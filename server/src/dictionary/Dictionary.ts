import fs from 'fs';
import path from 'path';

import Trie from './Trie';

export default class Dictionary {
  static trie: Trie;

  static initialize(): void {
    this.trie = new Trie();

    const file = path.resolve(path.join(__dirname, './words.txt'));
    const words = fs.readFileSync(file, 'utf-8').split('\n');

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

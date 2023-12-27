class TrieNode {
  isEndOfWord: boolean;
  children: Record<string, TrieNode>;

  constructor() {
    this.isEndOfWord = false;
    this.children = {};
  }
}

export default class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let currNode = this.root;

    for (const character of word.toLowerCase()) {
      if (!currNode.children[character]) {
        currNode.children[character] = new TrieNode();
      }

      currNode = currNode.children[character];
    }

    currNode.isEndOfWord = true;
  }

  search(word: string): boolean {
    let currNode = this.root;

    for (const character of word.toLowerCase()) {
      if (!currNode.children[character]) {
        return false;
      }

      currNode = currNode.children[character];
    }

    return !!currNode && currNode.isEndOfWord;
  }
}

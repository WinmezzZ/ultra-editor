import type { EditorConfig, LexicalNode, NodeKey } from 'lexical';

import { TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  __className: string;

  static getType(): string {
    return 'emoji';
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.__className, node.__text, node.__key);
  }

  constructor(className: string, text: string, key?: NodeKey) {
    super(text, key);
    this.__className = className;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement('span');
    const inner = super.createDOM(config);

    dom.className = this.__className;
    inner.className = 'emoji-inner';
    dom.appendChild(inner);

    return dom;
  }

  updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
    const inner: null | HTMLElement = dom.firstChild as HTMLElement;

    if (inner === null) {
      return true;
    }
    super.updateDOM(prevNode, inner, config);

    return false;
  }
}

export function $isEmojiNode(node?: LexicalNode) {
  return node instanceof EmojiNode;
}

export function $createEmojiNode(className: string, emojiText: string) {
  return new EmojiNode(className, emojiText).setMode('token');
}

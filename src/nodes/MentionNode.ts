import type { EditorConfig, LexicalNode, NodeKey } from 'lexical';

import { TextNode } from 'lexical';

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';

export class MentionNode extends TextNode {
  __mention: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }

  constructor(mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
  }

  createDOM<EditorContext>(config: EditorConfig<EditorContext>): HTMLElement {
    const dom = super.createDOM(config);

    dom.style.cssText = mentionStyle;
    dom.className = 'mention';

    return dom;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(mentionName: string): MentionNode {
  const mentionNode = new MentionNode(mentionName);

  mentionNode.setMode('segmented').toggleDirectionless();

  return mentionNode;
}

export function $isMentionNode(node?: LexicalNode) {
  return node instanceof MentionNode;
}

import { DecoratorNode, NodeKey, EditorConfig, LexicalEditor, LexicalNode } from 'lexical';
import { Popover } from 'ultra-design';

export class CostomLinkNode extends DecoratorNode<React.ReactNode> {
  __url: string;

  static getType(): string {
    return 'custom-link';
  }

  static clone(node: CostomLinkNode): CostomLinkNode {
    return new CostomLinkNode(node.__url, node.__key);
  }

  constructor(url: string, key?: NodeKey) {
    super(key);
    this.__url = url;
  }

  createDOM<EditorContext>(config: EditorConfig<EditorContext>): HTMLElement {
    const div = document.createElement('div');

    div.style.display = 'contents';

    return div;
  }

  updateDOM(): false {
    return false;
  }

  setURL(url: string): void {
    const writable = this.getWritable();

    writable.__url = url;
  }

  decorate(editor: LexicalEditor) {
    return (
      <Popover trigger="hover" content={this.__url}>
        <a href={this.__url}>{this.__url}</a>
      </Popover>
    );
  }
}

export function $createCostomLinkNode(url: string): CostomLinkNode {
  return new CostomLinkNode(url);
}

export function $isCostomLinkNode(node?: LexicalNode) {
  return node instanceof CostomLinkNode;
}

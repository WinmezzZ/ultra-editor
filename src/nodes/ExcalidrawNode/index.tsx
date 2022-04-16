import type { CommandListenerLowPriority, EditorConfig, LexicalEditor, LexicalNode, NodeKey } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useLexicalNodeSelection from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ExcalidrawImage from './ExcalidrawImage';
import ExcalidrawModal from './ExcalidrawModal';

const LowPriority: CommandListenerLowPriority = 1;

function ExcalidrawComponent({ nodeKey, data }: { data: string; nodeKey: NodeKey }) {
  const [isModalOpen, setModalOpen] = useState<boolean>(data === '[]');
  const [editor] = useLexicalComposerContext();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);

  const onDelete = useCallback(
    payload => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;

        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);

          if ($isExcalidrawNode(node)) {
            node.remove();
          }
          setSelected(false);
        });
      }

      return false;
    },
    [editor, isSelected, nodeKey, setSelected],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          const buttonElem = buttonRef.current;
          // $FlowFixMe: this will work
          const eventTarget = event.target as Element;

          if (buttonElem !== null && buttonElem.contains(eventTarget)) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            if (event.detail > 1) {
              setModalOpen(true);
            }

            return true;
          }

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, LowPriority),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, LowPriority),
    );
  }, [clearSelection, editor, isSelected, onDelete, setSelected]);

  const deleteNode = useCallback(() => {
    return editor.update(() => {
      const node = $getNodeByKey(nodeKey);

      if ($isExcalidrawNode(node)) {
        node.remove();
      }
    });
  }, [editor, nodeKey]);

  const setData = useCallback(
    (newData: string) => {
      return editor.update(() => {
        const node: any = $getNodeByKey(nodeKey);

        if ($isExcalidrawNode(node)) {
          node.setData(newData);
        }
      });
    },
    [editor, nodeKey],
  );

  const elements = useMemo(() => JSON.parse(data), [data]);

  return (
    <>
      <ExcalidrawModal
        initialElements={elements}
        isShown={isModalOpen}
        onDelete={deleteNode}
        onHide={() => setModalOpen(false)}
        onSave={newData => {
          setData(JSON.stringify(newData));
          setModalOpen(false);
        }}
      />
      <button ref={buttonRef} className={`excalidraw-button ${isSelected ? 'selected' : ''}`}>
        <ExcalidrawImage className="image" elements={elements} />
      </button>
    </>
  );
}

export class ExcalidrawNode extends DecoratorNode<React.ReactNode> {
  __data: string;

  static getType(): string {
    return 'excalidraw';
  }

  static clone(node: ExcalidrawNode): ExcalidrawNode {
    return new ExcalidrawNode(node.__data, node.__key);
  }

  constructor(data = '[]', key?: NodeKey) {
    super(key);
    this.__data = data;
  }

  // View
  createDOM<EditorContext>(config: EditorConfig<EditorContext>): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;

    if (className !== undefined) {
      span.className = className;
    }

    return span;
  }

  updateDOM(): false {
    return false;
  }

  setData(data: string): void {
    const self: any = this.getWritable();

    self.__data = data;
  }

  decorate(_editor: LexicalEditor) {
    return <ExcalidrawComponent nodeKey={this.getKey()} data={this.__data} />;
  }
}

export function $createExcalidrawNode(): ExcalidrawNode {
  return new ExcalidrawNode();
}

export function $isExcalidrawNode(node?: LexicalNode) {
  return node instanceof ExcalidrawNode;
}

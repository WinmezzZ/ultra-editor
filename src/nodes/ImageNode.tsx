import type { EditorConfig, LexicalEditor, LexicalNode, NodeKey } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import HashtagsPlugin from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LinkPlugin from '@lexical/react/LexicalLinkPlugin';
import LexicalNestedComposer from '@lexical/react/LexicalNestedComposer';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import TablesPlugin from '@lexical/react/LexicalTablePlugin';
import useLexicalNodeSelection from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createEditor,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import React from 'react';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import { useSharedHistoryContext } from '../context/SharedHistoryContext';
import EmojisPlugin from '../plugins/EmojisPlugin';
import ImagesPlugin from '../plugins/ImagesPlugin';
import KeywordsPlugin from '../plugins/KeywordsPlugin';
import MentionsPlugin from '../plugins/MentionsPlugin';
import TableCellActionMenuPlugin from '../plugins/TableActionMenuPlugin';
import ContentEditable from '../components/content-editable';
import ImageResizer from '../components/ImageResizer';
import Placeholder from '../components/placeholder';
import { css } from '@emotion/react';
import useUltraContext from '../context/ultra-context';
import { ConfigProviderProps } from 'ultra-design';
import { fade } from 'ultra-design/es/utils/fade';

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise(resolve => {
      const img = new Image();

      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: {
  altText: string;
  className?: string;
  height: 'inherit' | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: 'inherit' | number;
}) {
  useSuspenseImage(src);

  return (
    <img
      className={className}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width,
      }}
    />
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  showCaption,
  caption,
}: {
  altText: string;
  caption: LexicalEditor | any;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  showCaption: boolean;
  src: string;
  width: 'inherit' | number;
}) {
  const ultradContext = useUltraContext();
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState(null);

  const onDelete = useCallback(
    payload => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;

        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);

          if ($isImageNode(node)) {
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
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand(
        CLICK_COMMAND,
        (event: MouseEvent) => {
          if (isResizing) {
            return true;
          }
          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);

            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(KEY_DELETE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, onDelete, COMMAND_PRIORITY_LOW),
    );
  }, [clearSelection, editor, isResizing, isSelected, nodeKey, onDelete, setSelected]);

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as any;

      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const onResizeEnd = (nextWidth, nextHeight) => {
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey) as any;

      if ($isImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const { historyState } = useSharedHistoryContext();

  return (
    <Suspense fallback={null}>
      <LazyImage
        className={isSelected || isResizing ? 'focused' : null}
        src={src}
        altText={altText}
        imageRef={ref}
        width={width}
        height={height}
        maxWidth={maxWidth}
      />
      {showCaption && (
        <div css={imageCaptionStyle(ultradContext)}>
          <LexicalNestedComposer initialEditor={caption}>
            <MentionsPlugin />
            <TablesPlugin />
            <TableCellActionMenuPlugin />
            <ImagesPlugin />
            <LinkPlugin />
            <EmojisPlugin />
            <HashtagsPlugin />
            <KeywordsPlugin />

            <HistoryPlugin externalHistoryState={historyState} />
            <RichTextPlugin
              contentEditable={<ContentEditable className="ImageNode__contentEditable" />}
              placeholder={<Placeholder className="ImageNode__placeholder">输入图片描述...</Placeholder>}
              initialEditorState={null}
            />
          </LexicalNestedComposer>
        </div>
      )}
      {resizable && $isNodeSelection(selection) && (isSelected || isResizing) && (
        <ImageResizer
          showCaption={showCaption}
          setShowCaption={setShowCaption}
          editor={editor}
          imageRef={ref}
          maxWidth={maxWidth}
          onResizeStart={onResizeStart}
          onResizeEnd={onResizeEnd}
        />
      )}
    </Suspense>
  );
}

const imageCaptionStyle = (ultradContext: ConfigProviderProps) => {
  const { theme } = ultradContext;
  const { backgroundColor } = theme[theme.mode];

  return css`
    display: block;
    position: absolute;
    bottom: 4px;
    left: 0;
    right: 0;
    padding: 0;
    margin: 0;
    border-top: 1px solid ${backgroundColor};
    background-color: ${fade(backgroundColor, 0.6)};
    min-width: 100px;
    overflow: hidden;

    .ImageNode__contentEditable {
      box-sizing: content-box;
      min-height: 20px;
      border: 0px;
      resize: none;
      cursor: text;
      display: block;
      position: relative;
      tab-size: 1;
      outline: 0px;
      padding: 10px;
      user-select: text;
      font-size: 12px;
      width: calc(100% - 20px);
      white-space: pre-wrap;
      word-break: break-word;
    }

    .ImageNode__placeholder {
      font-size: 12px;
      color: #888;
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
      top: 10px;
      left: 10px;
      user-select: none;
      white-space: nowrap;
      display: inline-block;
      pointer-events: none;
    }
  `;
};

export class ImageNode extends DecoratorNode<React.ReactNode> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __maxWidth: number;
  __showCaption: boolean;
  __caption: LexicalEditor;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key,
    );
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
  }

  setWidthAndHeight(width: 'inherit' | number, height: 'inherit' | number): void {
    const writable = this.getWritable() as ImageNode;

    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable() as ImageNode;

    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
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

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): React.ReactNode {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
        resizable={true}
      />
    );
  }
}

export function $createImageNode(src: string, altText: string, maxWidth: number): ImageNode {
  return new ImageNode(src, altText, maxWidth);
}

export function $isImageNode(node: LexicalNode) {
  return node instanceof ImageNode;
}

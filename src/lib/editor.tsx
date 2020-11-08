import React, { FC, useRef } from 'react';
import { Typography, Divider, Card } from 'antd';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  ContentBlock,
  DraftHandleValue,
  KeyBindingUtil,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import InlineControls from './controls/InlineControls';
import BlockControls from './controls/BlockControls';
import HeaderControls from './controls/HeaderControls';
import 'antd/dist/antd.css';
import './editor.css';
import UndoRedoControls from './controls/UndoRedoControls';
import LinkControl from './controls/LinkControl';
import ImageControl from './controls/ImageControl';
import EmojiControl from './controls/EmojiControl';
import { ENTITY_TYPE } from './config/constant';
import DividerBlock from './controls/DividerControl/DividerBlock';
import DividerControl from './controls/DividerControl';
import decorator from './decorators';
import { ExtendedDraftEditorCommand } from './interface/editor';
import MediaEntity from './entries/MediaEntry';
import { createMediaEntity } from './entries/createMediaEntity';
import { EditorStore } from './store';
import { useStateWithCallback } from './hooks/useStateWithCallback';

const { Title } = Typography;

const { hasCommandModifier } = KeyBindingUtil;

const UltraEditor: FC = () => {
  const [editorState, setEditorState] = useStateWithCallback(EditorState.createEmpty(decorator));
  const editorRef = useRef<Editor>(null);

  const focus = () => {
    editorRef.current?.focus();
  };

  const handleKeyCommand = (command: ExtendedDraftEditorCommand, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      if (command === 'on-save') {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    }
    return 'not-handled';
  };

  const handlePastedFiles = (files: Blob[]): DraftHandleValue => {
    // upload to server logic
    const res = '';
    if (res) {
      setEditorState(createMediaEntity(editorState, ENTITY_TYPE.IMAGE, { src: res }));
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: React.KeyboardEvent): ExtendedDraftEditorCommand | null => {
    if (e.key === 'Tab') {
      const newEditorState = RichUtils.onTab(e, editorState, 4);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return null;
    } else if (e.key === 'S' && hasCommandModifier(e)) {
      return 'on-save';
    }
    return getDefaultKeyBinding(e);
  };

  let className = 'RichEditor-editor';
  const contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (
    <EditorStore.Provider value={{ editorState, setEditorState, focus }}>
      <br />
      <Title>Ultra Editor</Title>
      <Card
        className="RichEditor-root"
        bodyStyle={{ minHeight: 400 }}
        title={
          <div className="UltraEditor-controls">
            <UndoRedoControls />
            <Divider type="vertical" />
            <HeaderControls />
            <Divider type="vertical" />
            <InlineControls />
            <Divider type="vertical" />
            <BlockControls />
            <DividerControl />
            <LinkControl />
            <ImageControl />
            <EmojiControl />
          </div>
        }
      >
        <div className={className} onClick={focus}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            blockStyleFn={getBlockStyle}
            blockRendererFn={block => blockRendererFn(block, editorState)}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            handlePastedFiles={handlePastedFiles}
            stripPastedStyles
            placeholder="请输入..."
            ref={editorRef}
            spellCheck={true}
          />
        </div>
      </Card>
    </EditorStore.Provider>
  );
};

export default UltraEditor;

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block: ContentBlock): string {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return '';
  }
}

function blockRendererFn(block: ContentBlock, editorState: EditorState) {
  const type = block.getType();

  if (type === 'atomic') {
    const contentState = editorState.getCurrentContent();
    const entityKey = block.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);

    switch (entity.getType()) {
      case ENTITY_TYPE.HORIZONTAL_RULE:
        return {
          component: DividerBlock,
          editable: false,
        };
      case ENTITY_TYPE.AUDIO:
      case ENTITY_TYPE.IMAGE:
      case ENTITY_TYPE.VIDEO:
        return {
          component: MediaEntity,
          editable: false,
        };
      // case ENTITY_TYPE.LINK:
      //   return {
      //     component: LinkEntry,
      //     props: {
      //       editorState,
      //     },
      //   };
    }
  }
}

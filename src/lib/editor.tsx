import React, { FC, useRef } from 'react';
import { Typography, Divider, Card } from 'antd';
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  ContentBlock,
  DraftHandleValue,
  DraftEditorCommand,
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

const { Title } = Typography;

const UltraEditor: FC = () => {
  const [editorState, setEditorState] = React.useState(() => EditorState.createEmpty());
  const editorRef = useRef<Editor>(null);

  function focus() {
    editorRef.current?.focus();
  }

  const handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const mapKeyToEditorCommand = (e: React.KeyboardEvent): DraftEditorCommand | null => {
    if (e.key === 'Tab') {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = 'RichEditor-editor';
  const contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== 'unstyled') {
      className += ' RichEditor-hidePlaceholder';
    }
  }

  return (
    <>
      <br />
      <Title>Ultra Editor</Title>
      <Card
        className="RichEditor-root"
        bodyStyle={{ minHeight: 400 }}
        title={
          <div className="UltraEditor-controls">
            <UndoRedoControls editorState={editorState} setEditorState={setEditorState} />
            <Divider type="vertical" />
            <HeaderControls editorState={editorState} setEditorState={setEditorState} />
            <Divider type="vertical" />
            <InlineControls editorState={editorState} setEditorState={setEditorState} />
            <Divider type="vertical" />
            <BlockControls editorState={editorState} setEditorState={setEditorState} />
            <LinkControl editorState={editorState} setEditorState={setEditorState} />
            <ImageControl editorState={editorState} setEditorState={setEditorState} />
            <EmojiControl editorState={editorState} setEditorState={setEditorState} />
          </div>
        }
      >
        <div className={className} onClick={focus}>
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={mapKeyToEditorCommand}
            placeholder="请输入..."
            ref={editorRef}
            spellCheck={true}
          />
        </div>
      </Card>
    </>
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

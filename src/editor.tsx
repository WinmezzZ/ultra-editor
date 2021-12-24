import { Editor, EditorState, RichUtils, EditorProps, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import React, { useState } from 'react';
import BlockControls from './controls/block/block-controls';
import HeadingControl from './controls/heading/heading-controls';
import InlineControls from './controls/inline/inline-controls';
import { editorStyles } from './index.styles';
import { EditorProvider } from './utils/useEditorContext';

const { hasCommandModifier } = KeyBindingUtil;

export default function UltraEditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  const handleKeyCommand: EditorProps['handleKeyCommand'] = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      console.log(command);
      if (command === 'editor-save') {
        setEditorState(editorState);

        return 'handled';
      } else {
        return 'not-handled';
      }
    }

    return 'not-handled';
  };

  const keyBindingFn: EditorProps['keyBindingFn'] = e => {
    if (e.key === 's' && hasCommandModifier(e)) {
      return 'editor-save';
    }

    return getDefaultKeyBinding(e);
  };

  return (
    <EditorProvider
      value={{
        editorState,
        setEditorState,
      }}
    >
      <div css={editorStyles} className="ultra-editor-root">
        <div className="ultra-editor-toolbar">
          <InlineControls />
          <HeadingControl />
          <BlockControls />
        </div>
        <div className="ultra-editor">
          <Editor
            css={editorStyles}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
            blockStyleFn={blockStyleFn}
          />
        </div>
      </div>
    </EditorProvider>
  );
}

const blockStyleFn: EditorProps['blockStyleFn'] = block => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    default:
      return '';
  }
};

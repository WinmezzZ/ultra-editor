import {
  Editor,
  EditorState,
  RichUtils,
  EditorProps,
  KeyBindingUtil,
  getDefaultKeyBinding,
  ContentBlock,
} from 'draft-js';
import { useState } from 'react';
import { editorStyles } from './index.styles';
import { EditorProvider } from './utils/useEditorContext';
import HRControl from './controls/hr/hr-control';
import BlockControls from './controls/block/block-controls';
import HeadingControl from './controls/heading/heading-controls';
import InlineControls from './controls/inline/inline-controls';
import UndoRedoControls from './controls/undo-redo/undo-redo-controls';
import { BlOCK_TYPE, ENTITY_TYPE } from './config/constans';
import HRBlock from './controls/hr/hr-block';
import EmojiControl from './controls/emoji/emoji-control';
import LinkControl from './controls/link/link-control';
import { decorator } from './entries';
import LinkEntry from './entries/link-entry';

const { hasCommandModifier } = KeyBindingUtil;

export default function UltraEditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty(decorator));

  const handleKeyCommand: EditorProps['handleKeyCommand'] = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);

      if (command === 'editor-save') {
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
    } else if (e.key === 'Tab') {
      const newEditorState = RichUtils.onTab(e, editorState, 2);

      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }

      return null;
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
          <UndoRedoControls />
          <InlineControls />
          <HeadingControl />
          <BlockControls />
          <EmojiControl />
          <LinkControl />
          <HRControl />
        </div>
        <div className="ultra-editor">
          <Editor
            css={editorStyles}
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={keyBindingFn}
            blockStyleFn={blockStyleFn}
            blockRendererFn={c => blockRendererFn(c, editorState)}
            customStyleMap={styleMap}
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

const blockRendererFn = (contentBlock: ContentBlock, editorState: EditorState) => {
  const type = contentBlock.getType();

  if (type === BlOCK_TYPE.HR) {
    return {
      component: HRBlock,
      editable: false,
      props: {},
    };
  } else if (type === 'atomic') {
    const contentState = editorState.getCurrentContent();
    const entityKey = contentBlock.getEntityAt(0);
    const entity = contentState.getEntity(entityKey);

    switch (entity.getType()) {
      // case ENTITY_TYPE.AUDIO:
      // case ENTITY_TYPE.IMAGE:
      // case ENTITY_TYPE.VIDEO:
      //   return {
      //     component: MediaEntity,
      //     editable: false,
      //   };
      case ENTITY_TYPE.LINK:
        return {
          component: LinkEntry,
          props: {
            editorState,
          },
        };
    }
  }
};

const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

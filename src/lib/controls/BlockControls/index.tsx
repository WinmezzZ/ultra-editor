import React, { FC } from 'react';
import ControlContainer from 'lib/components/ControlContainer';
import { EditorState, RichUtils } from 'draft-js';
import { BLOCK_STYLES } from './blockStyles';

interface BlockControlsProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const BlockControls: FC<BlockControlsProps> = ({ editorState, setEditorState }) => {
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  const toggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, style));
  };

  return (
    <>
      {BLOCK_STYLES.map(block => (
        <ControlContainer
          key={block.style}
          active={block.style === blockType}
          title={block.title}
          onToggle={() => toggleStyle(block.style)}
        >
          {block.label}
        </ControlContainer>
      ))}
    </>
  );
};

export default BlockControls;

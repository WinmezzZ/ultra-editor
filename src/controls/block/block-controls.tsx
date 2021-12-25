import React, { FC } from 'react';
import ControlWrapper from '../../components/control-wrapper';
import { RichUtils } from 'draft-js';
import { BLOCK_STYLES } from './block-styles';
import { useEditContext } from '../../utils/useEditorContext';

const BlockControls: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  const toggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, style));
  };

  return (
    <>
      {BLOCK_STYLES.map(block => (
        <ControlWrapper
          key={block.style}
          active={block.style === blockType}
          title={block.title}
          onToggle={() => toggleStyle(block.style)}
        >
          {block.label}
        </ControlWrapper>
      ))}
    </>
  );
};

export default BlockControls;

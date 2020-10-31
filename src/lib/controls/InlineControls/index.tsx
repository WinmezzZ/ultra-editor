import React, { FC } from 'react';
import ControlContainer from 'lib/components/ControlContainer';
import { EditorState, RichUtils } from 'draft-js';
import { INLINE_STYLES } from './inlineStyles';

interface InlineControlsProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const InlineControls: FC<InlineControlsProps> = ({ editorState, setEditorState }) => {
  const currentStyle = (editorState.getCurrentInlineStyle() as unknown) as string;

  const toggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <>
      {INLINE_STYLES.map(inline => (
        <ControlContainer
          key={inline.style}
          active={inline.style === currentStyle}
          title={inline.title}
          onToggle={() => toggleStyle(inline.style)}
        >
          {inline.label}
        </ControlContainer>
      ))}
    </>
  );
};

export default InlineControls;

import React, { FC } from 'react';
import ControlContainer from 'lib/components/ControlContainer';
import { RichUtils } from 'draft-js';
import { INLINE_STYLES } from './inlineStyles';
import { useContext } from 'react';
import { EditorStore } from 'lib/store';

const InlineControls: FC = () => {
  const { editorState, setEditorState } = useContext(EditorStore);
  const currentStyle = editorState.getCurrentInlineStyle();

  const toggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <>
      {INLINE_STYLES.map(inline => (
        <ControlContainer
          key={inline.style}
          active={currentStyle.has(inline.style)}
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

import React, { FC } from 'react';
import ControlWrapper from '../../components/control-wrapper';
import { RichUtils } from 'draft-js';
import { INLINE_STYLES } from './inline-styles';
import { useEditContext } from '../../utils/useEditorContext';

const InlineControls: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const currentStyle = editorState.getCurrentInlineStyle();

  const toggleStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  return (
    <>
      {INLINE_STYLES.map(inline => (
        <ControlWrapper
          key={inline.style}
          active={currentStyle.has(inline.style)}
          title={inline.title}
          onToggle={() => toggleStyle(inline.style)}
        >
          {inline.label}
        </ControlWrapper>
      ))}
    </>
  );
};

export default InlineControls;

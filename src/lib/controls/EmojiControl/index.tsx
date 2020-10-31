import React, { FC } from 'react';
import { EditorState } from 'draft-js';
import { SmileOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';

interface EmojiControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const EmojiControl: FC<EmojiControlProps> = ({ editorState, setEditorState }) => {
  const onSelectPicture = () => {};

  return (
    <>
      <ControlContainer title="Emoji" onToggle={onSelectPicture}>
        <SmileOutlined />
      </ControlContainer>
    </>
  );
};

export default EmojiControl;

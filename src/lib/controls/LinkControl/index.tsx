import React, { FC } from 'react';
import { EditorState } from 'draft-js';
import { LinkOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';

interface LinkControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const LinkControl: FC<LinkControlProps> = ({ editorState, setEditorState }) => {
  const onSelectPicture = () => {};

  return (
    <>
      <ControlContainer title="Link" onToggle={onSelectPicture}>
        <LinkOutlined />
      </ControlContainer>
    </>
  );
};

export default LinkControl;

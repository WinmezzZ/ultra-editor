import React, { FC } from 'react';
import { EditorState } from 'draft-js';
import { PictureOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';

interface ImageControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const ImageControl: FC<ImageControlProps> = ({ editorState, setEditorState }) => {
  const onSelectPicture = () => {};

  return (
    <>
      <ControlContainer title="Image" onToggle={onSelectPicture}>
        <PictureOutlined />
      </ControlContainer>
    </>
  );
};

export default ImageControl;

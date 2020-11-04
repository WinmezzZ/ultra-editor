import React, { FC } from 'react';
import { EditorState } from 'draft-js';
import { PictureOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';
import { createMediaEntity } from 'lib/entries/createMediaEntity';
import { ENTITY_TYPE } from 'lib/config/constant';

interface ImageControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const ImageControl: FC<ImageControlProps> = ({ editorState, setEditorState }) => {
  const onSelectPicture = () => {
    const url = window.prompt('Input Image Url');
    const newEditorState = createMediaEntity(editorState, ENTITY_TYPE.IMAGE, {
      src: url,
    });

    setEditorState(newEditorState);
  };

  return (
    <>
      <ControlContainer title="Image" onToggle={onSelectPicture}>
        <PictureOutlined />
      </ControlContainer>
    </>
  );
};

export default ImageControl;

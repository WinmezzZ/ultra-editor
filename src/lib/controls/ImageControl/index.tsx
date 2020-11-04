import React, { FC, useContext } from 'react';
import { PictureOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';
import { createMediaEntity } from 'lib/entries/createMediaEntity';
import { ENTITY_TYPE } from 'lib/config/constant';
import { EditorStore } from 'lib/store';

const ImageControl: FC = () => {
  const { editorState, setEditorState, focus } = useContext(EditorStore);

  const onSelectPicture = () => {
    const url = window.prompt('Input Image Url');
    const newEditorState = createMediaEntity(editorState, ENTITY_TYPE.IMAGE, {
      src: url,
    });

    setEditorState(newEditorState, newState => {
      setTimeout(() => {
        console.log(focus);
        focus();
      }, 0);
    });
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

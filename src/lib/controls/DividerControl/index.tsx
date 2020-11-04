import React, { FC, useContext } from 'react';
import { MinusOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';
import { ENTITY_TYPE } from 'lib/config/constant';
import { createMediaEntity } from 'lib/entries/createMediaEntity';
import { EditorStore } from 'lib/store';

const DividerControl: FC = () => {
  const { editorState, setEditorState } = useContext(EditorStore);

  const onSelectPicture = () => {
    const newEditorState = createMediaEntity(editorState, ENTITY_TYPE.HORIZONTAL_RULE, {});

    setEditorState(newEditorState);
  };

  return (
    <>
      <ControlContainer title="Divider" onToggle={onSelectPicture}>
        <MinusOutlined />
      </ControlContainer>
    </>
  );
};

export default DividerControl;

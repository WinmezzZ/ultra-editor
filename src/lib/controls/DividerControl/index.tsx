import React, { FC } from 'react';
import { MinusOutlined } from '@ant-design/icons';
import { AtomicBlockUtils, EditorState } from 'draft-js';
import ControlContainer from 'lib/components/ControlContainer';
import { ENTITY_TYPE } from 'lib/config/constant';

interface DividerControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const DividerControl: FC<DividerControlProps> = ({ editorState, setEditorState }) => {
  const onSelectPicture = () => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(ENTITY_TYPE.HORIZONTAL_RULE, 'IMMUTABLE');
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

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

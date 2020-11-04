import React, { FC, useContext } from 'react';
import ControlContainer from 'lib/components/ControlContainer';
import { EditorState } from 'draft-js';
import { UNDO_REDO_STYLES, UndoRedoItem } from './UndoRedoStyles';
import { EditorStore } from 'lib/store';

const UndoRedoControls: FC = () => {
  const { editorState, setEditorState } = useContext(EditorStore);
  const allowUndo = editorState.getUndoStack().size === 0;
  const allowRedo = editorState.getRedoStack().size === 0;

  const toggleStyle = (style: UndoRedoItem['style']) => {
    setEditorState(EditorState[style](editorState));
  };

  return (
    <>
      {UNDO_REDO_STYLES.map(action => (
        <ControlContainer
          key={action.style}
          disabled={action.style === 'undo' ? allowUndo : allowRedo}
          title={action.title}
          onToggle={() => toggleStyle(action.style)}
        >
          {action.label}
        </ControlContainer>
      ))}
    </>
  );
};

export default UndoRedoControls;

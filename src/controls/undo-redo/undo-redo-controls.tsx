import { FC } from 'react';
import ControlWrapper from '../../components/control-wrapper';
import { EditorState } from 'draft-js';
import { UNDO_REDO_STYLES, UndoRedoItem } from './undo-redo-styles';
import { useEditContext } from '../../utils/useEditorContext';

const UndoRedoControls: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const allowUndo = editorState.getUndoStack().size === 0;
  const allowRedo = editorState.getRedoStack().size === 0;

  const toggleStyle = (style: UndoRedoItem['style']) => {
    setEditorState(EditorState[style](editorState));
  };

  return (
    <>
      {UNDO_REDO_STYLES.map(action => (
        <ControlWrapper
          key={action.style}
          disabled={action.style === 'undo' ? allowUndo : allowRedo}
          title={action.title}
          onToggle={() => toggleStyle(action.style)}
        >
          {action.label}
        </ControlWrapper>
      ))}
    </>
  );
};

export default UndoRedoControls;

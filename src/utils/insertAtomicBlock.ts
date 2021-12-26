import { AtomicBlockUtils, DraftEntityMutability, EditorState } from 'draft-js';
import { ENTITY_TYPE } from '../config/constans';

export const insertAtomicBlock = (
  editorState: EditorState,
  type: keyof typeof ENTITY_TYPE,
  mutability: DraftEntityMutability = 'MUTABLE',
  data = {},
) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(type, mutability, data);
  const entityKey = contentState.getLastCreatedEntityKey();
  const newState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

  return AtomicBlockUtils.insertAtomicBlock(newState, entityKey, ' ');
};

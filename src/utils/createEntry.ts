import { DraftEntityMutability, EditorState, RichUtils } from 'draft-js';
import { ENTITY_TYPE } from '../config/constans';
export const createEntry = (
  editorState: EditorState,
  entityType: keyof typeof ENTITY_TYPE,
  data: any,
  mutability: DraftEntityMutability = 'MUTABLE',
) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(entityType, mutability, data);
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newState = RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey);
  const selectionState = EditorState.forceSelection(newState, editorState.getSelection());

  return selectionState;
};

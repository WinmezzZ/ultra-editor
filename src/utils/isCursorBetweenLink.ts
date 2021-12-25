import { EditorState } from 'draft-js';
import { BlOCK_TYPE, ENTITY_TYPE } from '../config/constans';
export const getCurrentBlock = (editorState: EditorState) => {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const block = contentState.getBlockForKey(selectionState.getStartKey());

  return block;
};

export const isCursorBetweenLink = (editorState: EditorState) => {
  let ret = null;
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();
  const currentBlock = getCurrentBlock(editorState);

  if (!currentBlock) {
    return ret;
  }
  let entityKey = null;
  let blockKey = null;

  if (currentBlock.getType() !== BlOCK_TYPE.ATOMIC && selection.isCollapsed()) {
    if (currentBlock.getLength() > 0) {
      if (selection.getAnchorOffset() > 0) {
        entityKey = currentBlock.getEntityAt(selection.getAnchorOffset() - 1);
        blockKey = currentBlock.getKey();
        if (entityKey !== null) {
          const entity = content.getEntity(entityKey);

          if (entity.getType() === ENTITY_TYPE.LINK) {
            ret = {
              entityKey,
              blockKey,
              url: entity.getData().url,
              label: entity.getData().label,
            };
          }
        }
      }
    }
  }

  return ret;
};

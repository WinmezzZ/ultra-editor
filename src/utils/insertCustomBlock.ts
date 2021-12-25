import { BlockMapBuilder, ContentBlock, ContentState, EditorState, genKey, Modifier } from 'draft-js';
import { List } from 'immutable';

export const insertCustomBlock = (editorState: EditorState, blockType: string) => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();

  const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

  const targetSelection = afterRemoval.getSelectionAfter();
  const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
  const insertionTarget = afterSplit.getSelectionAfter();

  const asCustomBlock = Modifier.setBlockType(afterSplit, insertionTarget, blockType);

  const fragmentArray = [
    new ContentBlock({
      key: genKey(),
      type: blockType,
      text: '',
      characterList: List(),
    }),
    new ContentBlock({
      key: genKey(),
      type: 'unstyled',
      text: '',
      characterList: List(),
    }),
  ];

  const fragment = BlockMapBuilder.createFromArray(fragmentArray);

  const withCustomBlock = Modifier.replaceWithFragment(asCustomBlock, insertionTarget, fragment);

  const newContent = withCustomBlock.merge({
    selectionBefore: selectionState,
    selectionAfter: withCustomBlock.getSelectionAfter().set('hasFocus', true),
  });

  return EditorState.push(editorState, newContent as ContentState, 'insert-fragment');
};

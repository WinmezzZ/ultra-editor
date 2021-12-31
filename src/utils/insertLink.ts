import {
  CharacterMetadata,
  ContentBlock,
  ContentState,
  EditorState,
  genKey,
  RichUtils,
  SelectionState,
} from 'draft-js';
import { List, Repeat } from 'immutable';

interface LinkData {
  url: string;
  label: string;
}

export function insertLink(editorState: EditorState, LinkData: LinkData) {
  const selectionState = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const currentBlock = contentState.getBlockForKey(selectionState.getStartKey());
  const currentBlockKey = currentBlock.getKey();
  const blockMap = contentState.getBlockMap();
  const blocksBefore = blockMap.toSeq().takeUntil(v => v === currentBlock);
  const blocksAfter = blockMap
    .toSeq()
    .skipUntil(v => v === currentBlock)
    .rest();
  const newBlockKey = genKey();

  // add new ContentBlock to editor state with appropriate text
  const newBlock = new ContentBlock({
    key: newBlockKey,
    type: 'unstyled',
    text: LinkData.label,
    characterList: List(Repeat(CharacterMetadata.create(), LinkData.label.length)),
  });

  const newBlockMap = blocksBefore
    .concat(
      [
        [currentBlockKey, currentBlock],
        [newBlockKey, newBlock],
      ],
      blocksAfter,
    )
    .toOrderedMap();

  const selection = editorState.getSelection();

  const newContent = contentState.merge({
    blockMap: newBlockMap,
    selectionBefore: selection,
    selectionAfter: selection.merge({
      anchorKey: newBlockKey,
      anchorOffset: 0,
      focusKey: newBlockKey,
      focusOffset: 0,
      isBackward: false,
    }),
  }) as ContentState;

  let newEditorState = EditorState.push(editorState, newContent, 'split-block');

  // programmatically apply selection on this text
  let newSelection = new SelectionState({
    anchorKey: newBlockKey,
    anchorOffset: 0,
    focusKey: newBlockKey,
    focusOffset: LinkData.label.length,
  });

  newEditorState = EditorState.forceSelection(newEditorState, newSelection);

  // create link entity
  const newContentState = contentState;

  const contentStateWithEntity = newContentState.createEntity('LINK', 'IMMUTABLE', { url: LinkData.url });

  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  newEditorState = EditorState.set(newEditorState, { currentContent: contentStateWithEntity });

  newEditorState = RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey);

  // reset selection
  newSelection = new SelectionState({
    anchorKey: newBlockKey,
    anchorOffset: LinkData.label.length,
    focusKey: newBlockKey,
    focusOffset: LinkData.label.length,
  });

  const newEditorStateWithSelection = EditorState.forceSelection(newEditorState, newSelection);

  return newEditorStateWithSelection;
}

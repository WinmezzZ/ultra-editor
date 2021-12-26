import { EditorState, RichUtils } from 'draft-js';

export function editorStateSettingLink(editorState: EditorState, data: any) {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const entityKey = getCurrentLinkEntityKey(editorState);

  let nextEditorState = editorState;

  if (!entityKey) {
    const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', data);
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    nextEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    nextEditorState = RichUtils.toggleLink(nextEditorState, selection, entityKey);
  } else {
    nextEditorState = EditorState.set(editorState, {
      currentContent: editorState.getCurrentContent().replaceEntityData(entityKey, data),
    });
    // this is a hack that forces the editor to update
    // https://github.com/facebook/draft-js/issues/1047
    nextEditorState = EditorState.forceSelection(nextEditorState, editorState.getSelection());
  }

  return nextEditorState;
}

export function getCurrentLinkEntityKey(editorState: EditorState) {
  const contentState = editorState.getCurrentContent();
  const startKey = editorState.getSelection().getStartKey();
  const startOffset = editorState.getSelection().getStartOffset();
  const block = contentState.getBlockForKey(startKey);
  const linkKey = block.getEntityAt(Math.min(block.getText().length - 1, startOffset));

  if (linkKey) {
    const linkInstance = contentState.getEntity(linkKey);

    if (linkInstance.getType() === 'LINK') {
      return linkKey;
    }
  }

  return null;
}

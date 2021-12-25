import React, { FC, useContext, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Input, Modal } from 'ultra-design';
import ControlContainer from '../../components/control-wrapper';
import { ENTITY_TYPE } from '../../config/constans';
import { useEditContext } from '../../utils/useEditorContext';
import { Link, Text } from '@icon-park/react';

const ValidUrlReg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

const LinkControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('http://baidu.com');

  const onShowLinkModalVisible = (e: any) => {
    setLinkModalVisible(true);
    e.preventDefault();
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        const { label, url } = linkInstance.getData();

        setLinkLabel(label);
        setLinkUrl(url);
      }
    }
  };

  const onCancel = () => {
    setLinkModalVisible(false);
  };

  const onOk = () => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const textWithSpace = linkLabel.concat(' ');
    // create new content with text
    const newContent = Modifier.insertText(contentState, selection, textWithSpace);
    // create new link entity
    const newContentWithEntity = newContent.createEntity(ENTITY_TYPE.LINK, 'MUTABLE', {
      label: linkLabel,
      url: linkUrl,
    });
    const entityKey = newContentWithEntity.getLastCreatedEntityKey();
    // create new selection with the inserted text
    const anchorOffset = selection.getAnchorOffset();
    const newSelection = new SelectionState({
      anchorKey: selection.getAnchorKey(),
      anchorOffset,
      focusKey: selection.getAnchorKey(),
      focusOffset: anchorOffset + linkLabel.length,
    });
    // and aply link entity to the inserted text
    const newContentWithLink = Modifier.applyEntity(newContentWithEntity, newSelection, entityKey);
    // create new state with link text
    const withLinkText = EditorState.push(editorState, newContentWithLink, 'insert-characters');
    // now lets add cursor right after the inserted link
    const withProperCursor = EditorState.forceSelection(withLinkText, newContent.getSelectionAfter());

    setEditorState(withProperCursor);
    setLinkModalVisible(false);
  };

  return (
    <>
      <ControlContainer title="Link" onToggle={onShowLinkModalVisible}>
        <Link />
      </ControlContainer>
      <Modal
        width="400px"
        title="Inset Link"
        visible={linkModalVisible}
        onClose={onCancel}
        onOk={onOk}
        confirmButton={{
          disabled: !(linkLabel && linkUrl && ValidUrlReg.test(linkUrl)),
        }}
        keyboard={false}
      >
        <Input
          value={linkLabel}
          onChange={value => setLinkLabel(value)}
          placeholder="Enter the link label"
          icon={<Text />}
          autoFocus
        />
        <Input value={linkUrl} onChange={value => setLinkUrl(value)} placeholder="Enter the link url" icon={<Link />} />
      </Modal>
    </>
  );
};

export default LinkControl;

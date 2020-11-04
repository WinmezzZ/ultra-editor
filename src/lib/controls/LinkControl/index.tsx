import React, { FC, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Input, Modal } from 'antd';
import { LinkOutlined, createFromIconfontCN } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';
import { ENTITY_TYPE } from 'lib/config/constant';

const TextIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2170513_opqjpd9r6us.js',
});

const ValidUrlReg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

interface LinkControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

const LinkControl: FC<LinkControlProps> = ({ editorState, setEditorState }) => {
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
        <LinkOutlined />
      </ControlContainer>
      <Modal
        width="400px"
        centered
        title="Inset Link"
        visible={linkModalVisible}
        onCancel={onCancel}
        onOk={onOk}
        okButtonProps={{
          disabled: !(linkLabel && linkUrl && ValidUrlReg.test(linkUrl)),
        }}
        maskClosable={false}
        keyboard={false}
      >
        <Input
          value={linkLabel}
          onChange={value => setLinkLabel(value.currentTarget.value)}
          placeholder="Enter the link label"
          prefix={<TextIcon type="icon-text" />}
          style={{ marginBottom: 16 }}
          autoFocus
        />
        <Input
          value={linkUrl}
          onChange={value => setLinkUrl(value.currentTarget.value)}
          placeholder="Enter the link url"
          prefix={<LinkOutlined />}
        />
      </Modal>
    </>
  );
};

export default LinkControl;

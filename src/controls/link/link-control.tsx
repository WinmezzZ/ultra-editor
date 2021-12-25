import React, { FC, useMemo, useState } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';
import { Input, Modal } from 'ultra-design';
import ControlContainer from '../../components/control-wrapper';
import { ENTITY_TYPE } from '../../config/constans';
import { useEditContext } from '../../utils/useEditorContext';
import { Link, Text } from '@icon-park/react';
import { isCursorBetweenLink } from '../../utils/isCursorBetweenLink';
import { createEntry } from '../../utils/createEntry';

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
    const newEditorState = createEntry(editorState, 'LINK', { url: linkUrl, label: linkLabel });

    console.log(newEditorState);

    setEditorState(newEditorState);
    setLinkModalVisible(false);
  };

  const disabledLink = useMemo(() => {
    const isBetweenLink = isCursorBetweenLink(editorState);

    if (!isBetweenLink) return false;

    const { entityKey } = isBetweenLink;

    if (entityKey === null) {
      return false;
    }

    return true;
  }, [editorState]);

  return (
    <>
      <ControlContainer title="Link" disabled={disabledLink} onToggle={onShowLinkModalVisible}>
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

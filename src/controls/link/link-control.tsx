import React, { FC, useMemo, useState } from 'react';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import { Input, Modal } from 'ultra-design';
import ControlWrapper from '../../components/control-wrapper';
import { ENTITY_TYPE } from '../../config/constans';
import { useEditContext } from '../../utils/useEditorContext';
import { Link, Text } from '@icon-park/react';
import { isCursorBetweenLink } from '../../utils/isCursorBetweenLink';
import { getCurrentTextSelection } from '../../utils/getCurrentTextSelection';

const ValidUrlReg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

const LinkControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('https://www.baidu.com');

  const onShowLinkModalVisible = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = editorState.getSelection();

    setLinkModalVisible(true);

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
      } else {
        const textSelection = getCurrentTextSelection(editorState);

        if (textSelection) {
          setLinkLabel(textSelection);
        }
      }
    }
  };

  const onCancel = () => {
    setLinkLabel('');
    setLinkUrl('');
    setLinkModalVisible(false);
  };

  const onOk = (e: React.MouseEvent) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    const contentStateWithEntity = editorState
      .getCurrentContent()
      .createEntity(ENTITY_TYPE.LINK, 'MUTABLE', { url: linkUrl, label: linkLabel });
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      selection,
      `${linkLabel} `,
      editorState.getCurrentInlineStyle(),
      entityKey,
    );

    const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
    const selectionState = EditorState.forceSelection(newEditorState, editorState.getSelection());

    const new2 = RichUtils.toggleLink(selectionState, selectionState.getSelection(), entityKey);

    setEditorState(new2);
    setLinkModalVisible(false);
  };

  // const updateLink = () => {
  //   const contentState = editorState.getCurrentContent();

  //   // contentState.replaceEntityData(linkKey, { url: linkUrl, label: linkLabel });
  // };

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
      <ControlWrapper title="Link" disabled={disabledLink} onToggle={onShowLinkModalVisible}>
        <Link />
      </ControlWrapper>
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
          autoFocus={!linkLabel}
        />
        <Input
          value={linkUrl}
          onChange={value => setLinkUrl(value)}
          placeholder="Enter the link url"
          icon={<Link />}
          autoFocus={!linkUrl || !!linkLabel}
        />
      </Modal>
    </>
  );
};

export default LinkControl;

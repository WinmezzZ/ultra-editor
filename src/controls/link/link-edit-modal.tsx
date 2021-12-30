import React, { FC, useEffect, useState } from 'react';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import { Input, Modal } from 'ultra-design';
import { ENTITY_TYPE } from '../../config/constans';
import { useEditContext } from '../../utils/useEditorContext';
import { Link, Text } from '@icon-park/react';
import { getCurrentTextSelection } from '../../utils/getCurrentTextSelection';

const ValidUrlReg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i;

const LinkEditModal: FC = () => {
  const {
    editorState,
    setEditorState,
    currentEntityKey,
    linkData,
    setLinkData,
    linkModalVisible,
    setLinkModalVisible,
  } = useEditContext();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  useEffect(() => {
    if (!linkModalVisible) return;
    setIsUpdate(false);
    setIsToggle(false);
    const selection = editorState.getSelection();

    setLinkModalVisible(true);

    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);

      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      if (linkKey) {
        setIsUpdate(true);
        const linkInstance = contentState.getEntity(linkKey);
        const data = linkInstance.getData();

        setLinkData(data);
      } else {
        const textSelection = getCurrentTextSelection(editorState);

        if (textSelection) {
          setLinkData(v => ({ ...v, label: textSelection }));
          setIsToggle(true);
        }
      }
    }
  }, [linkModalVisible]);

  const onCancel = () => {
    setLinkData({
      label: '',
      url: '',
    });
    setLinkModalVisible(false);
  };

  const onOk = (e: React.MouseEvent) => {
    e.preventDefault();

    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();

    if (isUpdate) {
      console.log(currentEntityKey);
      const contentStateWithMerge = contentState.mergeEntityData(currentEntityKey, { ...linkData });
      const newEditorState = EditorState.set(editorState, contentStateWithMerge);

      // const contentStateWithLink = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
      // const newEditorState = EditorState.set(editorState, {
      //   currentContent: contentStateWithLink,
      // });

      setEditorState(newEditorState);
    } else {
      const contentStateWithEntity = contentState.createEntity(ENTITY_TYPE.LINK, 'MUTABLE', linkData);
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

      if (isToggle) {
        const newEditorState = EditorState.set(editorState, {
          currentContent: contentStateWithEntity,
        });

        setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey));
      } else {
        const contentStateWithText = Modifier.replaceText(
          editorState.getCurrentContent(),
          selection,
          `${linkData.label}`,
          editorState.getCurrentInlineStyle(),
          entityKey,
        );

        const newEditorState = EditorState.push(editorState, contentStateWithText, 'insert-characters');
        const selectionState = EditorState.moveFocusToEnd(newEditorState);

        setEditorState(selectionState);
      }
    }

    setLinkModalVisible(false);
  };

  return (
    <Modal
      width="400px"
      title="Inset Link"
      visible={linkModalVisible}
      onClose={onCancel}
      onOk={onOk}
      confirmButton={{
        disabled: !(linkData.label && linkData.url && ValidUrlReg.test(linkData.url)),
      }}
      keyboard={false}
    >
      <Input
        value={linkData.label}
        onChange={value => setLinkData(v => ({ ...v, label: value }))}
        placeholder="Enter the link label"
        icon={<Text />}
        autoFocus={!linkData.label}
      />
      <Input
        value={linkData.url}
        onChange={value => setLinkData(v => ({ ...v, url: value }))}
        placeholder="Enter the link url"
        icon={<Link />}
        autoFocus={!linkData.url || !!linkData.label}
      />
    </Modal>
  );
};

export default LinkEditModal;

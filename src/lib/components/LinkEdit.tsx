import React, { FC, useEffect, useState } from 'react';
import { Button, Popover } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { EditorState, SelectionState } from 'draft-js';
import { isCursorBetweenLink } from 'lib/util/isCursorBetweenLink';

interface LinkEditProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
  visible: boolean;
  onChange: (visible: boolean) => void;
}

const LinkEdit: FC<LinkEditProps> = props => {
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const { editorState, setEditorState, visible, onChange } = props;

  useEffect(() => {
    const isBetweenLink = isCursorBetweenLink(editorState);

    if (!isBetweenLink) return;

    const { entityKey, blockKey, url, label } = isBetweenLink;

    if (entityKey === null) {
      return;
    }

    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    block.findEntityRanges(
      character => {
        const eKey = character.getEntity();
        return eKey === entityKey;
      },
      (start, end) => {
        const selection = new SelectionState({
          anchorKey: blockKey,
          focusKey: blockKey,
          anchorOffset: start,
          focusOffset: end,
        });
        const newEditorState = EditorState.forceSelection(editorState, selection);
        setEditorState(newEditorState);
        setLinkLabel(label);
        setLinkUrl(url);
        onChange(true);
      },
    );
  });

  return (
    <Popover
      content={
        <div className="LinkEdit-wrapper">
          <p>
            <a href={linkUrl}>{linkUrl}</a>
          </p>
          <div>
            <Button size="small" style={{ marginRight: 16 }} icon={<EditOutlined />}>
              Edit
            </Button>
            <Button size="small" icon={<DeleteOutlined />}>
              Remove
            </Button>
          </div>
        </div>
      }
      placement="bottom"
      trigger={['click', 'hover', 'focus']}
      mouseLeaveDelay={0}
      visible={visible}
      onVisibleChange={onChange}
    ></Popover>
  );
};

export default LinkEdit;

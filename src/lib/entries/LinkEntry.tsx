import React, { FC, useEffect, useState } from 'react';
import { Button, Popover } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ContentState } from 'draft-js';
import { isCursorBetweenLink } from 'lib/util/isCursorBetweenLink';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = props => {
  const { contentState, entityKey } = props;
  const [visible, setVisible] = useState(false);
  const data = contentState.getEntity(entityKey).getData();
  const { label, url } = data;

  useEffect(() => {
    const isBetweenLink = isCursorBetweenLink({} as any);

    if (!isBetweenLink) return;

    const { entityKey } = isBetweenLink;

    if (entityKey === null) {
      return;
    }

    setVisible(true);

    // const content = editorState.getCurrentContent();
    // const block = content.getBlockForKey(blockKey);
    // block.findEntityRanges(
    //   character => {
    //     const eKey = character.getEntity();
    //     return eKey === entityKey;
    //   },
    //   (start, end) => {
    //     const selection = new SelectionState({
    //       anchorKey: blockKey,
    //       focusKey: blockKey,
    //       anchorOffset: start,
    //       focusOffset: end,
    //     });
    //     const newEditorState = EditorState.forceSelection(editorState, selection);
    //     setEditorState(newEditorState);
    //     setLinkLabel(label);
    //     setLinkUrl(url);
    //     onChange(true);
    //   },
    // );
  }, []);

  return (
    <Popover
      content={
        <div className="LinkEdit-wrapper">
          <p>
            <a href={url}>{label}</a>
          </p>
          <div>
            <Button icon={<EditOutlined />}>Edit</Button>
            <Button icon={<DeleteOutlined />}>Remove</Button>
          </div>
        </div>
      }
      trigger={['click', 'hover', 'focus']}
      placement="bottom"
      mouseLeaveDelay={0}
      visible={visible}
      onVisibleChange={e => setVisible(e)}
    >
      <a href={url}>{label}</a>
    </Popover>
  );
};

export default LinkEntry;

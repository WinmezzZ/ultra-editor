import React, { FC, useEffect, useState } from 'react';
// import { Button, Popover } from 'antd';
// import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ContentBlock, ContentState } from 'draft-js';
// import { isCursorBetweenLink } from 'lib/util/isCursorBetweenLink';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = props => {
  const { contentState, entityKey } = props;
  const [visible, setVisible] = useState(false);
  const data = contentState.getEntity(entityKey).getData();
  const { label, url } = data;

  // useEffect(() => {
  //   const isBetweenLink = isCursorBetweenLink({} as any);

  //   if (!isBetweenLink) return;

  //   const { entityKey } = isBetweenLink;

  //   if (entityKey === null) {
  //     return;
  //   }

  //   setVisible(true);

  // }, []);

  return (
    // <Popover
    //   content={
    //     <div className="LinkEdit-wrapper">
    //       <p>
    //         <a href={url}>{label}</a>
    //       </p>
    //       <div>
    //         <Button icon={<EditOutlined />}>Edit</Button>
    //         <Button icon={<DeleteOutlined />}>Remove</Button>
    //       </div>
    //     </div>
    //   }
    //   trigger={['click', 'hover', 'focus']}
    //   placement="bottom"
    //   mouseLeaveDelay={0}
    //   visible={visible}
    //   onVisibleChange={e => setVisible(e)}
    // >
    <a href={url}>{label}</a>
    // </Popover>
  );
};

export default LinkEntry;

export function findLinkEntities(
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState,
) {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();

    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}

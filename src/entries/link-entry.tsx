import { FC } from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import { Popover } from 'ultra-design';
import { Edit, Share, Unlink } from '@icon-park/react';
import { css } from '@emotion/react';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = props => {
  const { contentState, entityKey } = props;
  const data = contentState.getEntity(entityKey).getData();
  const { label, url } = data;

  return (
    <Popover
      layerClassName="UltraEditor-LinkEdit"
      getLayerContainer={node => node.parentNode as HTMLElement}
      content={
        <div css={linkEditLayerStyles}>
          <Share className="ultra-icon" title="访问链接" />
          {/* <Tooltip title="编辑链接"></Tooltip> */}
          <Edit className="ultra-icon" title="编辑链接" />
          <Unlink className="ultra-icon" title="取消链接" />
        </div>
      }
      trigger="hover"
    >
      <a href={url}>{label}</a>
    </Popover>
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

const linkEditLayerStyles = css`
  display: flex;
  align-items: center;
  .ultra-icon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin: 0 12px;
  }
`;

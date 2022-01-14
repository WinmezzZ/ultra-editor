import React, { FC } from 'react';
import { ContentBlock, ContentState, RichUtils } from 'draft-js';
import { Popover, Tooltip } from 'ultra-design';
import { Edit, Unlink } from '@icon-park/react';
import { css } from '@emotion/react';
import { useEditContext } from '../utils/useEditorContext';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = props => {
  const { contentState, entityKey } = props;
  const data = contentState.getEntity(entityKey).getData();
  const { url } = data;

  const { editorState, setEditorState, setCurrentEntityKey, setLinkModalVisible } = useEditContext();

  const handleUnLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const newEditorState = RichUtils.toggleLink(editorState, selection, null);

      console.log(entityKey, newEditorState);

      setEditorState(newEditorState);
    }
  };
  const handleUpdateLink = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentEntityKey(entityKey);
    setLinkModalVisible(true);
  };

  return (
    <Popover
      layerClassName="UltraEditor-LinkEdit"
      getLayerContainer={node => node?.parentNode as HTMLElement}
      content={
        <div css={linkEditLayerStyles} contentEditable={false}>
          <Tooltip title="访问链接">
            <a className="ultra-edit-link" href={url} target="_blank">
              {url}
            </a>
          </Tooltip>
          <Tooltip title="编辑链接">
            <Edit className="ultra-icon" onClick={handleUpdateLink} />
          </Tooltip>

          <Tooltip title="取消链接">
            <Unlink className="ultra-icon" onClick={handleUnLink} />
          </Tooltip>
        </div>
      }
      trigger="hover"
    >
      <a href={url}>{props.children}</a>
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
  .ultra-edit-link {
    display: block;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ultra-icon {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin: 0 12px;
  }
`;

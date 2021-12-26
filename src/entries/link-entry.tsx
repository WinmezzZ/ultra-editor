import React, { FC } from 'react';
import { ContentBlock, ContentState, EditorState, RichUtils } from 'draft-js';
import { Popover } from 'ultra-design';
import { Edit, Share, Unlink } from '@icon-park/react';
import { css } from '@emotion/react';
import { useEditContext } from '../utils/useEditorContext';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = props => {
  const { contentState, entityKey } = props;
  const data = contentState.getEntity(entityKey).getData();
  const { label, url } = data;

  const { editorState, setEditorState } = useEditContext();

  const handleUnLink = (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = editorState.getSelection();

    if (!selection.isCollapsed()) {
      const newEditorState = RichUtils.toggleLink(editorState, selection, null);

      console.log(entityKey, newEditorState);

      setEditorState(newEditorState);
    }
  };

  return (
    <Popover
      layerClassName="UltraEditor-LinkEdit"
      getLayerContainer={node => node.parentNode as HTMLElement}
      content={
        <div css={linkEditLayerStyles} contentEditable={false}>
          <a className="ultra-edit-link" href={url} target="_blank" title={url}>
            {url}
          </a>
          {/* <Tooltip title="编辑链接"></Tooltip> */}
          <Edit className="ultra-icon" title="编辑链接" />
          <Unlink className="ultra-icon" title="取消链接" onClick={handleUnLink} />
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

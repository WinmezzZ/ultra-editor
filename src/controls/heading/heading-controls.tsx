import React, { FC, useEffect, useState } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { HEADER_STYLES, CoreDraftHeaderType } from './heading-styles';
import { Select } from 'ultra-design';
import { useEditContext } from '../../utils/useEditorContext';
import { css } from '@emotion/react';

const HeadingControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const [currentHeader, setCurrentHeader] = useState<CoreDraftHeaderType>('unstyled');
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType() as CoreDraftHeaderType;

  useEffect(() => {
    if (HEADER_STYLES.every(header => header.style !== blockType)) return;
    setCurrentHeader(blockType);
  }, [blockType]);

  const onSelect = (value: CoreDraftHeaderType) => {
    setCurrentHeader(value);

    const contentState = editorState.getCurrentContent();
    const newEditorStateWithFocus = EditorState.forceSelection(editorState, contentState.getSelectionAfter());

    setEditorState(RichUtils.toggleBlockType(newEditorStateWithFocus, value));
  };

  const createElement = (title: string) => {
    const t = title.toLocaleLowerCase();

    return t.includes('h') ? React.createElement(t, null, title) : title;
  };

  return (
    <Select css={headingStyles} value={currentHeader} onChange={onSelect}>
      {HEADER_STYLES.map(header => {
        return (
          <Select.Option key={header.style} value={header.style}>
            {createElement(header.title)}
          </Select.Option>
        );
      })}
    </Select>
  );
};

export default HeadingControl;

const headingStyles = css`
  .ultra-select__selection {
    font-size: 13px;
    * {
      font-size: 13px;
      margin: 0 !important;
      padding: 0 !important;
    }
  }
`;

import React, { FC, useState } from 'react';
import { RichUtils } from 'draft-js';
import { HEADER_STYLES, CoreDraftHeaderType } from './heading-styles';
import { Select } from 'ultra-design';
import { useEditContext } from '../../utils/useEditorContext';

const HeadingControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const [currentHeader, setCurrentHeader] = useState<CoreDraftHeaderType>('unstyled');

  const onSelect = (value: CoreDraftHeaderType) => {
    setCurrentHeader(value);
    setEditorState(RichUtils.toggleBlockType(editorState, value));
  };

  const createElement = (title: string) => {
    const t = title.toLocaleLowerCase();

    return t.includes('h') ? React.createElement(t, null, title) : title;
  };

  return (
    <Select value={currentHeader} onChange={onSelect}>
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

import React, { FC, useState } from 'react';
import { EditorState, Modifier } from 'draft-js';
import { Popover } from 'ultra-design';
import ControlContainer from '../../components/control-wrapper';
import { emojiData } from './emoji-data';
import { useEditContext } from '../../utils/useEditorContext';
import { SmilingFace } from '@icon-park/react';
import { css, Global } from '@emotion/react';

const EmojiControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();
  const [popoverVisible, setPopoverVisible] = useState(false);

  const onShowPopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  const onSelectEmoji = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, emoji: string) => {
    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle(),
    );

    const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
    const newEditorStateWithFocus = EditorState.forceSelection(newEditorState, contentState.getSelectionAfter());

    setEditorState(newEditorStateWithFocus);
    setPopoverVisible(false);
  };

  return (
    <>
      <Popover
        visible={popoverVisible}
        onVisibleChange={v => setPopoverVisible(v)}
        layerClassName="ultra-editor-emoji-layer"
        content={
          <ul css={layerStyles}>
            {emojiData.map((emoji, index) => {
              return (
                <li className="emoji-item" key={index} onClick={e => onSelectEmoji(e, emoji)}>
                  <span>{emoji}</span>
                </li>
              );
            })}
          </ul>
        }
      >
        <ControlContainer tooltip={!popoverVisible} title="Emoji" onToggle={onShowPopover}>
          <SmilingFace />
        </ControlContainer>
      </Popover>

      <Global
        styles={css`
          .ultra-tooltip.ultra-editor-emoji-layer .ultra-tooltip__title {
            padding-left: 0;
            padding-right: 0;
          }
        `}
      />
    </>
  );
};

export default EmojiControl;

const layerStyles = css`
  width: 260px;
  max-height: 320px;
  margin: 0;
  padding: 0 12px;
  list-style: none;
  overflow-y: auto;

  .emoji-item {
    float: left;
    cursor: pointer;
    margin: 2px;
    padding: 4px;
  }
`;

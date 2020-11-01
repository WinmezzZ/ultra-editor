import React, { FC, useState } from 'react';
import { EditorState, Modifier } from 'draft-js';
import { Popover } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import ControlContainer from 'lib/components/ControlContainer';
import { emojis } from 'lib/controls/EmojiControl/emojis';
import './index.css';

interface EmojiControlProps {
  editorState: EditorState;
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
}

// const insertEmoji = (event, props) => {
//   let emoji = event.currentTarget.dataset.emoji;
//   const hookReturns = props.hooks('insert-emoji', emoji)(emoji);

//   if (hookReturns === false) {
//     return false;
//   }

//   if (typeof hookReturns === 'string') {
//     emoji = hookReturns;
//   }

//   props.editor.setValue(ContentUtils.insertText(props.editorState, emoji));
//   props.editor.requestFocus();

//   return true;
// };

const EmojiControl: FC<EmojiControlProps> = ({ editorState, setEditorState }) => {
  const [popoverVisible, setPopoverVisible] = useState(false);

  const onShowPopover = () => {
    setPopoverVisible(!popoverVisible);
  };

  const onSelectEmoji = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, emoji: string) => {
    e.preventDefault();

    const contentState = Modifier.replaceText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      emoji,
      editorState.getCurrentInlineStyle(),
    );
    setEditorState(EditorState.push(editorState, contentState, 'insert-characters'));
    setPopoverVisible(false);
  };

  return (
    <Popover
      visible={popoverVisible}
      onVisibleChange={v => setPopoverVisible(v)}
      trigger="click"
      placement="bottom"
      content={
        <ul className="emoji-popover-content">
          {emojis.map((emoji, index) => {
            return (
              <li key={index} onClick={e => onSelectEmoji(e, emoji)}>
                <span>{emoji}</span>
              </li>
            );
          })}
        </ul>
      }
    >
      <ControlContainer title="Emoji" onToggle={onShowPopover}>
        <SmileOutlined />
      </ControlContainer>
    </Popover>
  );
};

export default EmojiControl;

import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { mergeRegister } from '@lexical/utils';
import { $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from 'lexical';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { SPEECT_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from './SpeechToTextPlugin';
import { css } from '@emotion/react';
import { Button, Modal, Tooltip } from 'ultra-design';
import { Delete, Lock, Microphone, Unlock } from '@icon-park/react';

export default function ActionsPlugins() {
  const [editor] = useLexicalComposerContext();
  const [isReadOnly, setIsReadyOnly] = useState(() => editor.isReadOnly());
  const [isSpeechToText, setIsSpeechToText] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  useEffect(() => {
    return mergeRegister(
      editor.registerReadOnlyListener(readOnly => {
        setIsReadyOnly(readOnly);
      }),
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();

        if (children.length > 1) {
          setIsEditorEmpty(false);
        } else {
          if ($isParagraphNode(children[0])) {
            const paragraphChildren = children[0].getChildren();

            setIsEditorEmpty(paragraphChildren.length === 0);
          } else {
            setIsEditorEmpty(false);
          }
        }
      });
    });
  }, [editor]);

  const convertFromMarkdown = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const children = root.getChildren();
      const count = children.length;
      let markdownString = '';

      for (let i = 0; i < count; i++) {
        const child = children[i];

        if ($isParagraphNode(child)) {
          if (markdownString.length) {
            markdownString += '\n';
          }
          const text = child.getTextContent();

          if (text.length) {
            markdownString += text;
          }
        }
      }

      $convertFromMarkdownString(markdownString, editor, $createHorizontalRuleNode);
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="actions" css={actionsStyles()}>
      {SUPPORT_SPEECH_RECOGNITION && (
        <Tooltip title="录音" placement="top">
          <Button
            onClick={() => {
              editor.dispatchCommand(SPEECT_TO_TEXT_COMMAND, !isSpeechToText);
              setIsSpeechToText(!isSpeechToText);
            }}
            className={'action-button action-button-mic ' + (isSpeechToText ? 'active' : '')}
          >
            <Microphone size="18" />
          </Button>
        </Tooltip>
      )}
      <Tooltip title="清空" placement="top">
        <Button
          className="action-button clear"
          disabled={isEditorEmpty}
          onClick={() => {
            Modal.confirm({
              title: '清空编辑器',
              content: '你确定要清空当前全部的编辑内容吗？',
              onOk: () => {
                editor.dispatchCommand(CLEAR_EDITOR_COMMAND, null);
                editor.focus();
              },
            });
          }}
        >
          <Delete size="18" />
        </Button>
      </Tooltip>
      <Tooltip title="只读" placement="top">
        <Button
          className="action-button lock"
          onClick={() => {
            editor.setReadOnly(!editor.isReadOnly());
          }}
        >
          {isReadOnly ? <Unlock size="18" /> : <Lock size="18" />}
        </Button>
      </Tooltip>
      <Tooltip title="markdown" placement="top">
        <Button className="action-button" onClick={convertFromMarkdown}>
          <span style={{ fontSize: 18 }}> M</span>
        </Button>
      </Tooltip>
    </div>
  );
}

const actionsStyles = () => {
  return css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px;
    .action-button {
      margin-left: 5px;
    }
    .action-button-mic.active {
      animation: mic-pulsate-color 3s infinite;
    }

    @keyframes mic-pulsate-color {
      0% {
        background-color: #ffdcdc;
      }
      50% {
        background-color: #ff8585;
      }
      100% {
        background-color: #ffdcdc;
      }
    }
  `;
};

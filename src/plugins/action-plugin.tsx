import { $convertFromMarkdownString } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { $createTextNode, $getRoot, $isParagraphNode, CLEAR_EDITOR_COMMAND } from 'lexical';
import { FC, useCallback, useEffect, useState } from 'react';

import { SPEECH_TO_TEXT_COMMAND, SUPPORT_SPEECH_RECOGNITION } from './speech-to-text-plugin';
import { css } from '@emotion/react';
import { Button, Modal, Tooltip } from 'ultra-design';
import { DeleteBinLineIcon, LockLineIcon, LockUnlockLineIcon, MicrophoneFillIcon, MarkdownLineIcon } from 'ultra-icon';
import { $isCodeNode } from '@lexical/code';
import { UlTRA_TRANSFORMERS } from './markdown-transformers';
import { $convertToMarkdownString } from '@lexical/markdown';
import { $createCodeNode } from '@lexical/code';
import { CodeNode } from '@lexical/code';

const ActionsPlugins: FC = () => {
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

  const handleMarkdownToggle = useCallback(() => {
    editor.update(() => {
      const root = $getRoot();
      const firstChild = root.getFirstChild() as typeof CodeNode;

      if ($isCodeNode(firstChild) && firstChild.getLanguage() === 'markdown') {
        $convertFromMarkdownString(firstChild.getTextContent(), UlTRA_TRANSFORMERS);
      } else {
        const markdown = $convertToMarkdownString(UlTRA_TRANSFORMERS);

        root.clear().append($createCodeNode('markdown').append($createTextNode(markdown)));
      }
      root.selectEnd();
    });
  }, [editor]);

  return (
    <div className="actions" css={actionsStyles()}>
      {SUPPORT_SPEECH_RECOGNITION && (
        <Tooltip title="录音" placement="top">
          <Button
            onClick={() => {
              editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
              setIsSpeechToText(!isSpeechToText);
            }}
            className={'action-button action-button-mic ' + (isSpeechToText ? 'active' : '')}
          >
            <MicrophoneFillIcon />
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
          <DeleteBinLineIcon />
        </Button>
      </Tooltip>
      <Tooltip title="只读" placement="top">
        <Button
          className="action-button lock"
          onClick={() => {
            editor.setReadOnly(!editor.isReadOnly());
          }}
        >
          {isReadOnly ? <LockUnlockLineIcon /> : <LockLineIcon />}
        </Button>
      </Tooltip>
      <Tooltip title="markdown" placement="top">
        <Button className="action-button" onClick={handleMarkdownToggle}>
          <MarkdownLineIcon />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ActionsPlugins;

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

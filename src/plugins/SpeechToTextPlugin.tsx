import type { LexicalCommand, RangeSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  createCommand,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { useEffect, useRef, useState } from 'react';

import useReport from '../hooks/useReport';

export const SPEECT_TO_TEXT_COMMAND: LexicalCommand<boolean> = createCommand();

const VOICE_COMMANDS: Readonly<{
  [x: string]: ({ editor: LexicalEditor, selection: RangeSelection }) => void;
}> = {
  '\n': ({ selection }) => {
    selection.insertParagraph();
  },
  redo: ({ editor }) => {
    editor.dispatchCommand(REDO_COMMAND);
  },
  undo: ({ editor }) => {
    editor.dispatchCommand(UNDO_COMMAND);
  },
};

export const SUPPORT_SPEECH_RECOGNITION: boolean = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;

function SpeechToTextPlugin(): null {
  const [editor] = useLexicalComposerContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const recognition = useRef<any>(null);
  const report = useReport();

  useEffect(() => {
    if (isEnabled && recognition.current === null) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'zh-CN';
      recognition.current.addEventListener('result', (event: any) => {
        const resultItem = event.results.item(event.resultIndex);
        const { transcript } = resultItem.item(0);

        report(transcript);

        if (!resultItem.isFinal) {
          return;
        }

        editor.update(() => {
          const selection = $getSelection() as RangeSelection;

          if ($isRangeSelection(selection)) {
            const command = VOICE_COMMANDS[transcript.toLowerCase().trim()];

            if (command) {
              command({ editor, selection });
            } else if (transcript.match(/\s*\n\s*/)) {
              selection.insertParagraph();
            } else {
              selection.insertText(transcript);
            }
          }
        });
      });
    }

    if (recognition.current) {
      if (isEnabled) {
        recognition.current.start();
      } else {
        recognition.current.stop();
      }
    }

    return () => {
      if (recognition.current !== null) {
        recognition.current.stop();
      }
    };
  }, [editor, isEnabled, report]);

  useEffect(() => {
    return editor.registerCommand(
      SPEECT_TO_TEXT_COMMAND,
      (_isEnabled: boolean) => {
        setIsEnabled(_isEnabled);

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

export default SUPPORT_SPEECH_RECOGNITION ? SpeechToTextPlugin : () => null;

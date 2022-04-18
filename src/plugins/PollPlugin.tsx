import type { CommandListenerEditorPriority, LexicalCommand, RangeSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $isRootNode, createCommand } from 'lexical';
import { useEffect } from 'react';

import { $createPollNode, PollNode } from '../nodes/PollNode';

const EditorPriority: CommandListenerEditorPriority = 0;

export const INSERT_POLL_COMMAND: LexicalCommand<string> = createCommand();

export default function PollPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PollNode])) {
      throw new Error('PollPlugin: PollNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_POLL_COMMAND,
      payload => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          const question = payload as string;
          const pollNode = $createPollNode(question);

          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph();
          }
          selection.insertNodes([pollNode]);
        }

        return true;
      },
      EditorPriority,
    );
  }, [editor]);

  return null;
}

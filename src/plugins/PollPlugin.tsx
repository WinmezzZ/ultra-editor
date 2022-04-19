import type { LexicalCommand, RangeSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, $getSelection, $isRangeSelection, $isRootNode, createCommand } from 'lexical';
import { useEffect } from 'react';

import { $createPollNode, PollNode } from '../nodes/PollNode';

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
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

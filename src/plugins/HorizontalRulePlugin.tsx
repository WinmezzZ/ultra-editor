import type { RangeSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { COMMAND_PRIORITY_EDITOR, $getSelection, $isRangeSelection } from 'lexical';
import { useEffect } from 'react';

export default function HorizontalRulePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      () => {
        const selection = $getSelection() as RangeSelection;

        if (!$isRangeSelection(selection)) {
          return false;
        }

        const focusNode = selection.focus.getNode();

        if (focusNode !== null) {
          const horizontalRuleNode = $createHorizontalRuleNode();

          selection.insertParagraph();
          selection.focus.getNode().getTopLevelElementOrThrow().insertBefore(horizontalRuleNode);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

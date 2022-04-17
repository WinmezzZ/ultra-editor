import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalCommand, createCommand, $getSelection, RangeSelection } from 'lexical';
import { useEffect } from 'react';
import { $createCostomLinkNode } from '../nodes/CostomLinkNode';

type CommandPayload = string;

export const INSERT_COSTOM_LINK_COMMAND: LexicalCommand<CommandPayload> = createCommand();

export default function CostomLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Similar with command listener, which returns unlisten callback
    const removeListener = editor.registerCommand(
      INSERT_COSTOM_LINK_COMMAND,
      (payload: string) => {
        // Adding custom command that will be handled by this plugin
        editor.update(() => {
          const selection = $getSelection() as RangeSelection;

          if (selection !== null) {
            const url: string = payload;

            selection.insertNodes([$createCostomLinkNode(url)]);
          }
        });

        // Returning true indicates that command is handled and no further propagation is required
        return true;
      },
      0,
    );

    return () => {
      removeListener();
    };
  }, [editor]);

  return null;
}

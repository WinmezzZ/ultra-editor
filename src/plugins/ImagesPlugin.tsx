import type { LexicalCommand, RangeSelection } from 'lexical';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_EDITOR, $getSelection, $isRangeSelection, $isRootNode, createCommand } from 'lexical';
import { useEffect } from 'react';

import yellowFlowerImage from '../images/yellow-flower.jpg';
import { $createImageNode, ImageNode } from '../nodes/ImageNode';

export const INSERT_IMAGE_COMMAND: LexicalCommand<void> = createCommand();

export default function ImagesPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      () => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          if ($isRootNode(selection.anchor.getNode())) {
            selection.insertParagraph();
          }
          const imageNode = $createImageNode(yellowFlowerImage, 'Yellow flower in tilt shift lens', 500);

          selection.insertNodes([imageNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}

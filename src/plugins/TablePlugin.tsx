const LexicalComposerContext = require('@lexical/react/LexicalComposerContext');
const table = require('../nodes/TableNode');
const lexical = require('lexical');
const react = require('react');

const EditorPriority = 0;

export default function TablePlugin() {
  const [editor] = LexicalComposerContext.useLexicalComposerContext();

  react.useEffect(() => {
    if (!editor.hasNodes([table.TableNode, table.TableCellNode, table.TableRowNode])) {
      {
        throw Error(`TablePlugin: TableNode, TableCellNode or TableRowNode not registered on editor`);
      }
    }

    return editor.registerCommand(
      table.INSERT_TABLE_COMMAND,
      payload => {
        const { columns, rows } = payload;
        const selection = lexical.$getSelection();

        if (!lexical.$isRangeSelection(selection)) {
          return true;
        }

        const focus = selection.focus;
        const focusNode = focus.getNode();

        if (focusNode !== null) {
          const tableNode = table.$createTableNodeWithDimensions(Number(rows), Number(columns));

          if (lexical.$isRootNode(focusNode)) {
            const target = focusNode.getChildAtIndex(focus.offset);

            if (target !== null) {
              target.insertBefore(tableNode);
            } else {
              focusNode.append(tableNode);
            }

            tableNode.insertBefore(lexical.$createParagraphNode());
          } else {
            const topLevelNode = focusNode.getTopLevelElementOrThrow();

            topLevelNode.insertAfter(tableNode);
          }

          tableNode.insertAfter(lexical.$createParagraphNode());
          const firstCell = tableNode.getFirstChildOrThrow().getFirstChildOrThrow();

          firstCell.select();
        }

        return true;
      },
      EditorPriority,
    );
  }, [editor]);
  react.useEffect(() => {
    const tableSelections = new Map();

    return editor.registerMutationListener(table.TableNode, nodeMutations => {
      for (const [nodeKey, mutation] of nodeMutations) {
        if (mutation === 'created') {
          editor.update(() => {
            const tableElement = editor.getElementByKey(nodeKey);
            const tableNode = lexical.$getNodeByKey(nodeKey);

            if (tableElement && tableNode) {
              const tableSelection = table.applyTableHandlers(tableNode, tableElement, editor);

              tableSelections.set(nodeKey, tableSelection);
            }
          });
        } else if (mutation === 'destroyed') {
          const tableSelection = tableSelections.get(nodeKey);

          if (tableSelection) {
            tableSelection.removeListeners();
            tableSelections.delete(nodeKey);
          }
        }
      }
    });
  }, [editor]);

  return null;
}

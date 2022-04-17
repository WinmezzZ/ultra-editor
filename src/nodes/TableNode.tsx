'use strict';

const lexical = require('lexical');
const utils = require('@lexical/utils');

const TableCellHeaderStates = {
  NO_STATUS: 0,
  ROW: 1,
  COLUMN: 2,
  BOTH: 3,
};

class TableCellNode extends lexical.GridCellNode {
  static getType() {
    return 'tablecell';
  }

  static clone(node) {
    return new TableCellNode(node.__headerState, node.__colSpan, node.__width, node.__key);
  }

  static importDOM() {
    return {
      td: node => ({
        conversion: convertTableCellNodeElement,
        priority: 0,
      }),
      th: node => ({
        conversion: convertTableCellNodeElement,
        priority: 0,
      }),
    };
  }

  constructor(headerState = TableCellHeaderStates.NO_STATUS, colSpan = 1, width, key) {
    super(colSpan, key);
    this.__headerState = headerState;
    this.__width = width;
  }

  createDOM(config) {
    const element = document.createElement(this.getTag());

    if (this.__width) {
      element.style.width = `${this.__width}px`;
    }

    utils.addClassNamesToElement(element, config.theme.tableCell, this.hasHeader() && config.theme.tableCellHeader);

    return element;
  }

  exportDOM(editor) {
    const { element } = super.exportDOM(editor);

    if (element) {
      const maxWidth = 700;
      const colCount = this.getParentOrThrow().getChildrenSize();

      element.style.border = '1px solid black';
      element.style.width = `${this.getWidth() || Math.max(90, maxWidth / colCount)}px`;
      element.style.verticalAlign = 'top';
      element.style.textAlign = 'start';

      if (this.hasHeader()) {
        element.style.backgroundColor = '#f2f3f5';
      }
    }

    return {
      element,
    };
  }

  getTag() {
    return this.hasHeader() ? 'th' : 'td';
  }

  setHeaderStyles(headerState) {
    const self = this.getWritable();

    self.__headerState = headerState;

    return this.__headerState;
  }

  getHeaderStyles() {
    return this.getLatest().__headerState;
  }

  setWidth(width) {
    const self = this.getWritable();

    self.__width = width;

    return this.__width;
  }

  getWidth() {
    return this.getLatest().__width;
  }

  toggleHeaderStyle(headerStateToToggle) {
    const self = this.getWritable();

    if ((self.__headerState & headerStateToToggle) === headerStateToToggle) {
      self.__headerState -= headerStateToToggle;
    } else {
      self.__headerState += headerStateToToggle;
    }

    self.__headerState = self.__headerState;

    return self;
  }

  hasHeaderState(headerState) {
    return (this.getHeaderStyles() & headerState) === headerState;
  }

  hasHeader() {
    return this.getLatest().__headerState !== TableCellHeaderStates.NO_STATUS;
  }

  updateDOM(prevNode) {
    return prevNode.__headerState !== this.__headerState || prevNode.__width !== this.__width;
  }

  collapseAtStart() {
    return true;
  }

  canBeEmpty() {
    return false;
  }
}
function convertTableCellNodeElement(domNode) {
  const nodeName = domNode.nodeName.toLowerCase();
  const tableCellNode = $createTableCellNode(
    nodeName === 'th' ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS,
  );

  return {
    node: tableCellNode,
    forChild: (lexicalNode, parentLexicalNode) => {
      if ($isTableCellNode(parentLexicalNode) && !lexical.$isElementNode(lexicalNode)) {
        const paragraphNode = lexical.$createParagraphNode();

        if (lexical.$isLineBreakNode(lexicalNode) && lexicalNode.getTextContent() === '\n') {
          return null;
        }

        paragraphNode.append(lexicalNode);

        return paragraphNode;
      }

      return lexicalNode;
    },
  };
}
function $createTableCellNode(headerState, colSpan = 1, width) {
  return new TableCellNode(headerState, colSpan, width);
}
function $isTableCellNode(node) {
  return node instanceof TableCellNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class TableRowNode extends lexical.GridRowNode {
  static getType() {
    return 'tablerow';
  }

  static clone(node) {
    return new TableRowNode(node.__height, node.__key);
  }

  static importDOM() {
    return {
      tr: node => ({
        conversion: convertTableRowElement,
        priority: 0,
      }),
    };
  }

  constructor(height, key) {
    super(key);
    this.__height = height;
  }

  createDOM(config) {
    const element = document.createElement('tr');

    if (this.__height) {
      element.style.height = `${this.__height}px`;
    }

    utils.addClassNamesToElement(element, config.theme.tableRow);

    return element;
  }

  setHeight(height) {
    const self = this.getWritable();

    self.__height = height;

    return this.__height;
  }

  getHeight() {
    return this.getLatest().__height;
  }

  updateDOM(prevNode) {
    return prevNode.__height !== this.__height;
  }

  canBeEmpty() {
    return false;
  }
}
function convertTableRowElement(domNode) {
  return {
    node: $createTableRowNode(),
  };
}
function $createTableRowNode(height) {
  return new TableRowNode(height);
}
function $isTableRowNode(node) {
  return node instanceof TableRowNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const CAN_USE_DOM =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const getSelection = () => window.getSelection();

const getDOMSelection = getSelection;

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

if (CAN_USE_DOM) {
  const disableNativeSelectionUi = document.createElement('style');

  disableNativeSelectionUi.innerHTML = `
     table.disable-selection {
       -webkit-touch-callout: none;
       -webkit-user-select: none; 
       -khtml-user-select: none; 
       -moz-user-select: none; 
       -ms-user-select: none; 
       user-select: none;
     }
   
     .disable-selection span::selection{
       background-color: transparent;
     }
     .disable-selection br::selection{
       background-color: transparent;
     }
   `;

  if (document.body) {
    document.body.append(disableNativeSelectionUi);
  }
}

class TableSelection {
  constructor(editor, tableNodeKey) {
    this.isHighlightingCells = false;
    this.startX = -1;
    this.startY = -1;
    this.currentX = -1;
    this.currentY = -1;
    this.listenersToRemove = new Set();
    this.tableNodeKey = tableNodeKey;
    this.editor = editor;
    this.grid = {
      cells: [],
      columns: 0,
      rows: 0,
    };
    this.gridSelection = null;
    this.anchorCellNodeKey = null;
    this.focusCellNodeKey = null;
    this.anchorCell = null;
    this.focusCell = null;
    this.trackTableGrid();
  }

  getGrid() {
    return this.grid;
  }

  removeListeners() {
    Array.from(this.listenersToRemove).forEach(removeListener => removeListener());
  }

  trackTableGrid() {
    const observer = new MutationObserver(records => {
      this.editor.update(() => {
        let gridNeedsRedraw = false;

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const target = record.target;
          const nodeName = target.nodeName;

          if (nodeName === 'TABLE' || nodeName === 'TR') {
            gridNeedsRedraw = true;

            break;
          }
        }

        if (!gridNeedsRedraw) {
          return;
        }

        const tableElement = this.editor.getElementByKey(this.tableNodeKey);

        if (!tableElement) {
          throw new Error('Expected to find TableElement in DOM');
        }

        this.grid = getTableGrid(tableElement);
      });
    });

    this.editor.update(() => {
      const tableElement = this.editor.getElementByKey(this.tableNodeKey);

      if (!tableElement) {
        throw new Error('Expected to find TableElement in DOM');
      }

      this.grid = getTableGrid(tableElement);
      observer.observe(tableElement, {
        childList: true,
        subtree: true,
      });
    });
  }

  clearHighlight() {
    this.editor.update(() => {
      const tableNode = lexical.$getNodeByKey(this.tableNodeKey);

      if (!$isTableNode(tableNode)) {
        throw new Error('Expected TableNode.');
      }

      const tableElement = this.editor.getElementByKey(this.tableNodeKey);

      if (!tableElement) {
        throw new Error('Expected to find TableElement in DOM');
      }

      const grid = getTableGrid(tableElement);

      this.isHighlightingCells = false;
      this.startX = -1;
      this.startY = -1;
      this.currentX = -1;
      this.currentY = -1;
      this.gridSelection = null;
      this.anchorCellNodeKey = null;
      this.focusCellNodeKey = null;
      this.anchorCell = null;
      this.focusCell = null;
      $updateDOMForSelection(grid, null);
      lexical.$setSelection(null);
      this.editor.dispatchCommand(lexical.SELECTION_CHANGE_COMMAND);
      this.enableHighlightStyle();
    });
  }

  enableHighlightStyle() {
    this.editor.update(() => {
      const tableElement = this.editor.getElementByKey(this.tableNodeKey);

      if (!tableElement) {
        throw new Error('Expected to find TableElement in DOM');
      }

      tableElement.classList.remove('disable-selection');
    });
  }

  disableHighlightStyle() {
    this.editor.update(() => {
      const tableElement = this.editor.getElementByKey(this.tableNodeKey);

      if (!tableElement) {
        throw new Error('Expected to find TableElement in DOM');
      }

      tableElement.classList.add('disable-selection');
    });
  }

  adjustFocusCellForSelection(cell, ignoreStart = false) {
    this.editor.update(() => {
      const tableNode = lexical.$getNodeByKey(this.tableNodeKey);

      if (!$isTableNode(tableNode)) {
        throw new Error('Expected TableNode.');
      }

      const tableElement = this.editor.getElementByKey(this.tableNodeKey);

      if (!tableElement) {
        throw new Error('Expected to find TableElement in DOM');
      }

      const cellX = cell.x;
      const cellY = cell.y;

      this.focusCell = cell;
      const domSelection = getDOMSelection();

      if (this.anchorCell !== null) {
        // Collapse the selection
        domSelection.setBaseAndExtent(this.anchorCell.elem, 0, cell.elem, 0);
      }

      if (!this.isHighlightingCells && (this.startX !== cellX || this.startY !== cellY || ignoreStart)) {
        this.isHighlightingCells = true;
        this.disableHighlightStyle();
      } else if (cellX === this.currentX && cellY === this.currentY) {
        return;
      }

      this.currentX = cellX;
      this.currentY = cellY;

      if (this.isHighlightingCells) {
        const focusTableCellNode = lexical.$getNearestNodeFromDOMNode(cell.elem);

        if (this.gridSelection != null && this.anchorCellNodeKey != null && $isTableCellNode(focusTableCellNode)) {
          const focusNodeKey = focusTableCellNode.getKey();

          this.gridSelection = lexical.$createGridSelection();
          this.focusCellNodeKey = focusNodeKey;
          this.gridSelection.set(
            this.tableNodeKey, // $FlowFixMe This is not null, as you can see in the statement above.
            this.anchorCellNodeKey,
            this.focusCellNodeKey,
          );
          lexical.$setSelection(this.gridSelection);
          this.editor.dispatchCommand(lexical.SELECTION_CHANGE_COMMAND);
          $updateDOMForSelection(this.grid, this.gridSelection);
        }
      }
    });
  }

  setAnchorCellForSelection(cell) {
    this.editor.update(() => {
      this.anchorCell = cell;
      this.startX = cell.x;
      this.startY = cell.y;
      const domSelection = getDOMSelection();

      domSelection.setBaseAndExtent(cell.elem, 0, cell.elem, 0);
      const anchorTableCellNode = lexical.$getNearestNodeFromDOMNode(cell.elem);

      if ($isTableCellNode(anchorTableCellNode)) {
        const anchorNodeKey = anchorTableCellNode.getKey();

        this.gridSelection = lexical.$createGridSelection();
        this.anchorCellNodeKey = anchorNodeKey;
      }
    });
  }

  formatCells(type) {
    this.editor.update(() => {
      const selection = lexical.$getSelection();

      if (!lexical.$isGridSelection(selection)) {
        {
          throw Error(`Expected grid selection`);
        }
      } // This is to make Flow play ball.

      const formatSelection = lexical.$createRangeSelection();
      const anchor = formatSelection.anchor;
      const focus = formatSelection.focus;

      selection.getNodes().forEach(cellNode => {
        if ($isTableCellNode(cellNode) && cellNode.getTextContentSize() !== 0) {
          anchor.set(cellNode.getKey(), 0, 'element');
          focus.set(cellNode.getKey(), cellNode.getChildrenSize(), 'element');
          formatSelection.formatText(type);
        }
      });
      lexical.$setSelection(selection);
      this.editor.dispatchCommand(lexical.SELECTION_CHANGE_COMMAND);
    });
  }

  clearText() {
    this.editor.update(() => {
      const tableNode = lexical.$getNodeByKey(this.tableNodeKey);

      if (!$isTableNode(tableNode)) {
        throw new Error('Expected TableNode.');
      }

      const selection = lexical.$getSelection();

      if (!lexical.$isGridSelection(selection)) {
        {
          throw Error(`Expected grid selection`);
        }
      }

      const selectedNodes = selection.getNodes().filter($isTableCellNode);

      if (selectedNodes.length === this.grid.columns * this.grid.rows) {
        tableNode.selectPrevious(); // Delete entire table

        tableNode.remove();
        this.clearHighlight();

        return;
      }

      selectedNodes.forEach(cellNode => {
        if (lexical.$isElementNode(cellNode)) {
          const paragraphNode = lexical.$createParagraphNode();
          const textNode = lexical.$createTextNode();

          paragraphNode.append(textNode);
          cellNode.append(paragraphNode);
          cellNode.getChildren().forEach(child => {
            if (child !== paragraphNode) {
              child.remove();
            }
          });
        }
      });
      $updateDOMForSelection(this.grid, null);
      lexical.$setSelection(null);
      this.editor.dispatchCommand(lexical.SELECTION_CHANGE_COMMAND);
    });
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const CriticalPriority = 4;
const LEXICAL_ELEMENT_KEY = '__lexicalTableSelection';

function applyTableHandlers(tableNode, tableElement, editor) {
  const rootElement = editor.getRootElement();

  if (rootElement === null) {
    throw new Error('No root element.');
  }

  const tableSelection = new TableSelection(editor, tableNode.getKey());

  attachTableSelectionToTableElement(tableElement, tableSelection);
  let isMouseDown = false;
  let isRangeSelectionHijacked = false;

  tableElement.addEventListener('dblclick', event => {
    // $FlowFixMe: event.target is always a Node on the DOM
    const cell = getCellFromTarget(event.target);

    if (cell !== null) {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      tableSelection.setAnchorCellForSelection(cell);
      tableSelection.adjustFocusCellForSelection(cell, true);
      isMouseDown = false;
    }
  }); // This is the anchor of the selection.

  tableElement.addEventListener('mousedown', event => {
    setTimeout(() => {
      if (event.button !== 0) {
        return;
      } // $FlowFixMe: event.target is always a Node on the DOM

      const cell = getCellFromTarget(event.target);

      if (cell !== null) {
        tableSelection.setAnchorCellForSelection(cell);
        document.addEventListener(
          'mouseup',
          () => {
            isMouseDown = false;
          },
          {
            capture: true,
            once: true,
          },
        );
      }
    }, 0);
  }); // This is adjusting the focus of the selection.

  tableElement.addEventListener('mousemove', event => {
    if (isRangeSelectionHijacked) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }

    if (isMouseDown) {
      // $FlowFixMe: event.target is always a Node on the DOM
      const cell = getCellFromTarget(event.target);

      if (cell !== null) {
        const cellX = cell.x;
        const cellY = cell.y;

        if (
          isMouseDown &&
          (tableSelection.startX !== cellX || tableSelection.startY !== cellY || tableSelection.isHighlightingCells)
        ) {
          event.preventDefault();
          isMouseDown = true;
          tableSelection.adjustFocusCellForSelection(cell);
        }
      }
    }
  });
  tableElement.addEventListener('mouseup', event => {
    if (isMouseDown) {
      isMouseDown = false;
    }
  }); // Select entire table at this point, when grid selection is ready.

  tableElement.addEventListener('mouseleave', event => {
    if (isMouseDown) {
      return;
    }
  }); // Clear selection when clicking outside of dom.

  const mouseDownCallback = event => {
    isMouseDown = true;

    if (event.button !== 0) {
      return;
    }

    editor.update(() => {
      const selection = lexical.$getSelection();

      if (
        lexical.$isGridSelection(selection) &&
        selection.gridKey === tableSelection.tableNodeKey &&
        rootElement.contains(event.target)
      ) {
        return tableSelection.clearHighlight();
      }
    });
  };

  window.addEventListener('mousedown', mouseDownCallback);
  tableSelection.listenersToRemove.add(() => window.removeEventListener('mousedown', mouseDownCallback));

  const mouseUpCallback = event => {
    isMouseDown = false;
  };

  window.addEventListener('mouseup', mouseUpCallback);
  tableSelection.listenersToRemove.add(() => window.removeEventListener('mouseup', mouseUpCallback));
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_ARROW_DOWN_COMMAND,
      payload => {
        const selection = lexical.$getSelection();
        const event = payload;
        const direction = 'down';

        if (lexical.$isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

            if (!$isTableCellNode(tableCellNode)) {
              return false;
            }

            const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);
            const elementParentNode = utils.$findMatchingParent(selection.anchor.getNode(), n =>
              lexical.$isElementNode(n),
            );

            if (elementParentNode == null) {
              throw new Error('Expected BlockNode Parent');
            }

            const lastChild = tableCellNode.getLastChild();
            const isSelectionInLastBlock =
              (lastChild && elementParentNode.isParentOf(lastChild)) || elementParentNode === lastChild;

            if (isSelectionInLastBlock || event.shiftKey) {
              event.preventDefault();
              event.stopImmediatePropagation();
              event.stopPropagation(); // Start Selection

              if (event.shiftKey) {
                tableSelection.setAnchorCellForSelection(
                  tableNode.getCellFromCordsOrThrow(currentCords.x, currentCords.y, tableSelection.grid),
                );

                return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
              }

              return selectGridNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
            }
          }
        } else if (lexical.$isGridSelection(selection) && event.shiftKey) {
          const tableCellNode = selection.focus.getNode();

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);

          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();

          return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_ARROW_UP_COMMAND,
      payload => {
        const selection = lexical.$getSelection();
        const event = payload;
        const direction = 'up';

        if (lexical.$isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

            if (!$isTableCellNode(tableCellNode)) {
              return false;
            }

            const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);
            const elementParentNode = utils.$findMatchingParent(selection.anchor.getNode(), n =>
              lexical.$isElementNode(n),
            );

            if (elementParentNode == null) {
              throw new Error('Expected BlockNode Parent');
            }

            const lastChild = tableCellNode.getLastChild();
            const isSelectionInLastBlock =
              (lastChild && elementParentNode.isParentOf(lastChild)) || elementParentNode === lastChild;

            if (isSelectionInLastBlock || event.shiftKey) {
              event.preventDefault();
              event.stopImmediatePropagation();
              event.stopPropagation(); // Start Selection

              if (event.shiftKey) {
                tableSelection.setAnchorCellForSelection(
                  tableNode.getCellFromCordsOrThrow(currentCords.x, currentCords.y, tableSelection.grid),
                );

                return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
              }

              return selectGridNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
            }
          }
        } else if (lexical.$isGridSelection(selection) && event.shiftKey) {
          const tableCellNode = selection.focus.getNode();

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);

          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();

          return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_ARROW_LEFT_COMMAND,
      payload => {
        const selection = lexical.$getSelection();
        const event = payload;
        const direction = 'backward';

        if (lexical.$isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

            if (!$isTableCellNode(tableCellNode)) {
              return false;
            }

            const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);
            const elementParentNode = utils.$findMatchingParent(selection.anchor.getNode(), n =>
              lexical.$isElementNode(n),
            );

            if (elementParentNode == null) {
              throw new Error('Expected BlockNode Parent');
            }

            if (selection.anchor.offset === 0 || event.shiftKey) {
              event.preventDefault();
              event.stopImmediatePropagation();
              event.stopPropagation(); // Start Selection

              if (event.shiftKey) {
                tableSelection.setAnchorCellForSelection(
                  tableNode.getCellFromCordsOrThrow(currentCords.x, currentCords.y, tableSelection.grid),
                );

                return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
              }

              return selectGridNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
            }
          }
        } else if (lexical.$isGridSelection(selection) && event.shiftKey) {
          const tableCellNode = selection.focus.getNode();

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);

          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();

          return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_ARROW_RIGHT_COMMAND,
      payload => {
        const selection = lexical.$getSelection();
        const event = payload;
        const direction = 'forward';

        if (lexical.$isRangeSelection(selection)) {
          if (selection.isCollapsed()) {
            const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

            if (!$isTableCellNode(tableCellNode)) {
              return false;
            }

            const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);
            const elementParentNode = utils.$findMatchingParent(selection.anchor.getNode(), n =>
              lexical.$isElementNode(n),
            );

            if (elementParentNode == null) {
              throw new Error('Expected BlockNode Parent');
            }

            if (selection.anchor.offset === selection.anchor.getNode().getTextContentSize() || event.shiftKey) {
              event.preventDefault();
              event.stopImmediatePropagation();
              event.stopPropagation(); // Start Selection

              if (event.shiftKey) {
                tableSelection.setAnchorCellForSelection(
                  tableNode.getCellFromCordsOrThrow(currentCords.x, currentCords.y, tableSelection.grid),
                );

                return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
              }

              return selectGridNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
            }
          }
        } else if (lexical.$isGridSelection(selection) && event.shiftKey) {
          const tableCellNode = selection.focus.getNode();

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);

          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();

          return adjustFocusNodeInDirection(tableSelection, tableNode, currentCords.x, currentCords.y, direction);
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.DELETE_CHARACTER_COMMAND,
      () => {
        const selection = lexical.$getSelection();

        if (lexical.$isGridSelection(selection)) {
          tableSelection.clearText();

          return true;
        } else if (lexical.$isRangeSelection(selection)) {
          const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          if (
            selection.isCollapsed() &&
            selection.anchor.offset === 0 &&
            selection.anchor.getNode().getPreviousSiblings().length === 0
          ) {
            return true;
          }
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_BACKSPACE_COMMAND,
      payload => {
        const selection = lexical.$getSelection();

        if (lexical.$isGridSelection(selection)) {
          const event = payload;

          event.preventDefault();
          event.stopPropagation();
          tableSelection.clearText();

          return true;
        } else if (lexical.$isRangeSelection(selection)) {
          const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.FORMAT_TEXT_COMMAND,
      payload => {
        const selection = lexical.$getSelection();

        if (lexical.$isGridSelection(selection)) {
          tableSelection.formatCells(payload);

          return true;
        } else if (lexical.$isRangeSelection(selection)) {
          const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.INSERT_TEXT_COMMAND,
      payload => {
        const selection = lexical.$getSelection();

        if (lexical.$isGridSelection(selection)) {
          tableSelection.clearHighlight();

          return false;
        } else if (lexical.$isRangeSelection(selection)) {
          const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.KEY_TAB_COMMAND,
      payload => {
        const selection = lexical.$getSelection();

        if (lexical.$isRangeSelection(selection)) {
          const tableCellNode = utils.$findMatchingParent(selection.anchor.getNode(), n => $isTableCellNode(n));

          if (!$isTableCellNode(tableCellNode)) {
            return false;
          }

          const event = payload;

          if (selection.isCollapsed()) {
            const currentCords = tableNode.getCordsFromCellNode(tableCellNode, tableSelection.grid);

            event.preventDefault();
            selectGridNodeInDirection(
              tableSelection,
              tableNode,
              currentCords.x,
              currentCords.y,
              !event.shiftKey ? 'forward' : 'backward',
            );

            return true;
          }
        }

        return false;
      },
      CriticalPriority,
    ),
  );
  tableSelection.listenersToRemove.add(
    editor.registerCommand(
      lexical.SELECTION_CHANGE_COMMAND,
      payload => {
        const selection = lexical.$getSelection();

        if (selection && lexical.$isRangeSelection(selection) && !selection.isCollapsed()) {
          const anchorNode = selection.anchor.getNode();
          const focusNode = selection.focus.getNode();
          const isAnchorInside = tableNode.isParentOf(anchorNode);
          const isFocusInside = tableNode.isParentOf(focusNode);
          const containsPartialTable = (isAnchorInside && !isFocusInside) || (isFocusInside && !isAnchorInside);

          if (containsPartialTable) {
            const isBackward = selection.isBackward();
            const startNode = isBackward ? focusNode : anchorNode;
            const modifiedSelection = lexical.$createRangeSelection();
            const tableIndex = tableNode.getIndexWithinParent();
            const parentKey = tableNode.getParentOrThrow().getKey();

            isRangeSelectionHijacked = true;
            tableSelection.disableHighlightStyle();
            (isBackward ? modifiedSelection.focus : modifiedSelection.anchor).set(
              startNode.getKey(),
              (isBackward ? selection.focus : selection.anchor).offset,
              lexical.$isTextNode(startNode) ? 'text' : 'element',
            );
            (isBackward ? modifiedSelection.anchor : modifiedSelection.focus).set(
              parentKey,
              isBackward ? tableIndex - 1 : tableIndex + 1,
              'element',
            );
            lexical.$setSelection(modifiedSelection);
            $forEachGridCell(tableSelection.grid, cell => {
              const elem = cell.elem;

              cell.highlighted = true;
              elem.style.setProperty('background-color', 'rgb(172, 206, 247)');
              elem.style.setProperty('caret-color', 'transparent');
            });

            return true;
          }
        }

        if (isRangeSelectionHijacked && !tableNode.isSelected()) {
          tableSelection.enableHighlightStyle();
          $forEachGridCell(tableSelection.grid, cell => {
            const elem = cell.elem;

            cell.highlighted = false;
            elem.style.removeProperty('background-color');
            elem.style.removeProperty('caret-color');

            if (!elem.getAttribute('style')) {
              elem.removeAttribute('style');
            }
          });
          isRangeSelectionHijacked = false;

          return true;
        }

        return false;
      },
      CriticalPriority,
    ),
  );

  return tableSelection;
}
function attachTableSelectionToTableElement(tableElement, tableSelection) {
  // $FlowFixMe
  tableElement[LEXICAL_ELEMENT_KEY] = tableSelection;
}
function getTableSelectionFromTableElement(tableElement) {
  // $FlowFixMe
  return tableElement[LEXICAL_ELEMENT_KEY];
}
function getCellFromTarget(node) {
  let currentNode = node;

  while (currentNode != null) {
    const nodeName = currentNode.nodeName;

    if (nodeName === 'TD' || nodeName === 'TH') {
      // $FlowFixMe: internal field
      const cell = currentNode._cell;

      if (cell === undefined) {
        return null;
      }

      return cell;
    }

    currentNode = currentNode.parentNode;
  }

  return null;
}
function getTableGrid(tableElement) {
  const cells = [];
  const grid = {
    cells,
    columns: 0,
    rows: 0,
  };
  let currentNode = tableElement.firstChild;
  let x = 0;
  let y = 0;

  cells.length = 0;

  while (currentNode != null) {
    const nodeMame = currentNode.nodeName;

    if (nodeMame === 'TD' || nodeMame === 'TH') {
      // $FlowFixMe: TD is always an HTMLElement
      const elem = currentNode;
      const cell = {
        elem,
        highlighted: false,
        x,
        y,
      }; // $FlowFixMe: internal field

      currentNode._cell = cell;

      if (cells[y] === undefined) {
        cells[y] = [];
      }

      cells[y][x] = cell;
    } else {
      const child = currentNode.firstChild;

      if (child != null) {
        currentNode = child;

        continue;
      }
    }

    const sibling = currentNode.nextSibling;

    if (sibling != null) {
      x++;
      currentNode = sibling;

      continue;
    }

    const parent = currentNode.parentNode;

    if (parent != null) {
      const parentSibling = parent.nextSibling;

      if (parentSibling == null) {
        break;
      }

      y++;
      x = 0;
      currentNode = parentSibling;
    }
  }

  grid.columns = x + 1;
  grid.rows = y + 1;

  return grid;
}
function $updateDOMForSelection(grid, selection) {
  const highlightedCells = [];
  const selectedCellNodes = new Set(selection ? selection.getNodes() : []);

  $forEachGridCell(grid, (cell, lexicalNode) => {
    const elem = cell.elem;

    if (selectedCellNodes.has(lexicalNode)) {
      cell.highlighted = true;
      elem.style.setProperty('background-color', 'rgb(172, 206, 247)');
      elem.style.setProperty('caret-color', 'transparent');
      highlightedCells.push(cell);
    } else {
      cell.highlighted = false;
      elem.style.removeProperty('background-color');
      elem.style.removeProperty('caret-color');

      if (!elem.getAttribute('style')) {
        elem.removeAttribute('style');
      }
    }
  });

  return highlightedCells;
}
function $forEachGridCell(grid, cb) {
  const highlightedCells = [];
  const { cells } = grid;

  for (let y = 0; y < cells.length; y++) {
    const row = cells[y];

    for (let x = 0; x < row.length; x++) {
      const cell = row[x];
      const lexicalNode = lexical.$getNearestNodeFromDOMNode(cell.elem);

      if (lexicalNode !== null) {
        cb(cell, lexicalNode, {
          x,
          y,
        });
      }
    }
  }

  return highlightedCells;
}

const selectGridNodeInDirection = (tableSelection, tableNode, x, y, direction) => {
  switch (direction) {
    case 'backward':
    case 'forward': {
      const isForward = direction === 'forward';

      if (x !== (isForward ? tableSelection.grid.columns - 1 : 0)) {
        selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x + (isForward ? 1 : -1), y, tableSelection.grid));
      } else {
        if (y !== (isForward ? tableSelection.grid.rows - 1 : 0)) {
          selectTableCellNode(
            tableNode.getCellNodeFromCordsOrThrow(
              isForward ? 0 : tableSelection.grid.columns - 1,
              y + (isForward ? 1 : -1),
              tableSelection.grid,
            ),
          );
        } else if (!isForward) {
          tableNode.selectPrevious();
        } else {
          tableNode.selectNext();
        }
      }

      return true;
    }

    case 'up': {
      if (y !== 0) {
        selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x, y - 1, tableSelection.grid));
      } else {
        tableNode.selectPrevious();
      }

      return true;
    }

    case 'down': {
      if (y !== tableSelection.grid.rows - 1) {
        selectTableCellNode(tableNode.getCellNodeFromCordsOrThrow(x, y + 1, tableSelection.grid));
      } else {
        tableNode.selectNext();
      }

      return true;
    }
  }

  return false;
};

const adjustFocusNodeInDirection = (tableSelection, tableNode, x, y, direction) => {
  switch (direction) {
    case 'backward':
    case 'forward': {
      const isForward = direction === 'forward';

      if (x !== (isForward ? tableSelection.grid.columns - 1 : 0)) {
        tableSelection.adjustFocusCellForSelection(
          tableNode.getCellFromCordsOrThrow(x + (isForward ? 1 : -1), y, tableSelection.grid),
        );
      }

      return true;
    }

    case 'up': {
      if (y !== 0) {
        tableSelection.adjustFocusCellForSelection(tableNode.getCellFromCordsOrThrow(x, y - 1, tableSelection.grid));

        return true;
      } else {
        return false;
      }
    }

    case 'down': {
      if (y !== tableSelection.grid.rows - 1) {
        tableSelection.adjustFocusCellForSelection(tableNode.getCellFromCordsOrThrow(x, y + 1, tableSelection.grid));

        return true;
      } else {
        return false;
      }
    }
  }

  return false;
};

function selectTableCellNode(tableCell) {
  const possibleParagraph = tableCell.getChildren().find(n => lexical.$isParagraphNode(n));

  if (lexical.$isParagraphNode(possibleParagraph)) {
    possibleParagraph.selectEnd();
  } else {
    tableCell.selectEnd();
  }
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
class TableNode extends lexical.GridNode {
  static getType() {
    return 'table';
  }

  static clone(node) {
    return new TableNode(node.__key);
  }

  static importDOM() {
    return {
      table: node => ({
        conversion: convertTableElement,
        priority: 0,
      }),
    };
  }

  constructor(key) {
    super(key);
  }

  createDOM(config, editor) {
    const tableElement = document.createElement('table');

    utils.addClassNamesToElement(tableElement, config.theme.table);

    return tableElement;
  }

  updateDOM() {
    return false;
  }

  exportDOM(editor) {
    return {
      ...super.exportDOM(editor),
      after: tableElement => {
        if (tableElement) {
          const newElement = tableElement.cloneNode();
          const colGroup = document.createElement('colgroup');
          const tBody = document.createElement('tbody');

          tBody.append(...tableElement.children);
          const firstRow = this.getFirstChildOrThrow();

          if (!$isTableRowNode(firstRow)) {
            throw new Error('Expected to find row node.');
          }

          const colCount = firstRow.getChildrenSize();

          for (let i = 0; i < colCount; i++) {
            const col = document.createElement('col');

            colGroup.append(col);
          } //$FlowFixMe This function does exist and is supported by major browsers.

          newElement.replaceChildren(colGroup, tBody);

          return newElement;
        }
      },
    };
  }

  canExtractContents() {
    return false;
  }

  canBeEmpty() {
    return false;
  }

  getCordsFromCellNode(tableCellNode, grid) {
    if (!grid) {
      throw Error(`Grid not found.`);
    }

    const { rows, cells } = grid;

    for (let y = 0; y < rows; y++) {
      const row = cells[y];

      if (row == null) {
        throw new Error(`Row not found at y:${y}`);
      }

      const x = row.findIndex(({ elem }) => {
        const cellNode = lexical.$getNearestNodeFromDOMNode(elem);

        return cellNode === tableCellNode;
      });

      if (x !== -1) {
        return {
          x,
          y,
        };
      }
    }

    throw new Error('Cell not found in table.');
  }

  getCellFromCords(x, y, grid) {
    if (!grid) {
      throw Error(`Grid not found.`);
    }

    const { cells } = grid;
    const row = cells[y];

    if (row == null) {
      return null;
    }

    const cell = row[x];

    if (cell == null) {
      return null;
    }

    return cell;
  }

  getCellFromCordsOrThrow(x, y, grid) {
    const cell = this.getCellFromCords(x, y, grid);

    if (!cell) {
      throw new Error('Cell not found at cords.');
    }

    return cell;
  }

  getCellNodeFromCords(x, y, grid) {
    const cell = this.getCellFromCords(x, y, grid);

    if (cell == null) {
      return null;
    }

    const node = lexical.$getNearestNodeFromDOMNode(cell.elem);

    if ($isTableCellNode(node)) {
      return node;
    }

    return null;
  }

  getCellNodeFromCordsOrThrow(x, y, grid) {
    const node = this.getCellNodeFromCords(x, y, grid);

    if (!node) {
      throw new Error('Node at cords not TableCellNode.');
    }

    return node;
  }

  canSelectBefore() {
    return true;
  }
}
function $getElementGridForTableNode(editor, tableNode) {
  const tableElement = editor.getElementByKey(tableNode.getKey());

  if (tableElement == null) {
    throw new Error('Table Element Not Found');
  }

  return getTableGrid(tableElement);
}
function convertTableElement(domNode) {
  return {
    node: $createTableNode(),
  };
}
function $createTableNode() {
  return new TableNode();
}
function $isTableNode(node) {
  return node instanceof TableNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
function $createTableNodeWithDimensions(rowCount, columnCount, includeHeaders = true) {
  const tableNode = $createTableNode();

  for (let iRow = 0; iRow < rowCount; iRow++) {
    const tableRowNode = $createTableRowNode();

    for (let iColumn = 0; iColumn < columnCount; iColumn++) {
      let headerState = TableCellHeaderStates.NO_STATUS;

      if (includeHeaders) {
        if (iRow === 0) headerState |= TableCellHeaderStates.ROW;
        if (iColumn === 0) headerState |= TableCellHeaderStates.COLUMN;
      }

      const tableCellNode = $createTableCellNode(headerState);
      const paragraphNode = lexical.$createParagraphNode();

      paragraphNode.append(lexical.$createTextNode());
      tableCellNode.append(paragraphNode);
      tableRowNode.append(tableCellNode);
    }

    tableNode.append(tableRowNode);
  }

  return tableNode;
}
function $getTableCellNodeFromLexicalNode(startingNode) {
  const node = utils.$findMatchingParent(startingNode, n => $isTableCellNode(n));

  if ($isTableCellNode(node)) {
    return node;
  }

  return null;
}
function $getTableRowNodeFromTableCellNodeOrThrow(startingNode) {
  const node = utils.$findMatchingParent(startingNode, n => $isTableRowNode(n));

  if ($isTableRowNode(node)) {
    return node;
  }

  throw new Error('Expected table cell to be inside of table row.');
}
function $getTableNodeFromLexicalNodeOrThrow(startingNode) {
  const node = utils.$findMatchingParent(startingNode, n => $isTableNode(n));

  if ($isTableNode(node)) {
    return node;
  }

  throw new Error('Expected table cell to be inside of table.');
}
function $getTableRowIndexFromTableCellNode(tableCellNode) {
  const tableRowNode = $getTableRowNodeFromTableCellNodeOrThrow(tableCellNode);
  const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableRowNode);

  return tableNode.getChildren().findIndex(n => n.is(tableRowNode));
}
function $getTableColumnIndexFromTableCellNode(tableCellNode) {
  const tableRowNode = $getTableRowNodeFromTableCellNodeOrThrow(tableCellNode);

  return tableRowNode.getChildren().findIndex(n => n.is(tableCellNode));
}
function $getTableCellSiblingsFromTableCellNode(tableCellNode, grid) {
  const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
  const { x, y } = tableNode.getCordsFromCellNode(tableCellNode, grid);

  return {
    above: tableNode.getCellNodeFromCords(x, y - 1, grid),
    below: tableNode.getCellNodeFromCords(x, y + 1, grid),
    left: tableNode.getCellNodeFromCords(x - 1, y, grid),
    right: tableNode.getCellNodeFromCords(x + 1, y, grid),
  };
}
function $removeTableRowAtIndex(tableNode, indexToDelete) {
  const tableRows = tableNode.getChildren();

  if (indexToDelete >= tableRows.length || indexToDelete < 0) {
    throw new Error('Expected table cell to be inside of table row.');
  }

  const targetRowNode = tableRows[indexToDelete];

  targetRowNode.remove();

  return tableNode;
}
function $insertTableRow(tableNode, targetIndex, shouldInsertAfter = true, rowCount, grid) {
  const tableRows = tableNode.getChildren();

  if (targetIndex >= tableRows.length || targetIndex < 0) {
    throw new Error('Table row target index out of range');
  }

  const targetRowNode = tableRows[targetIndex];

  if ($isTableRowNode(targetRowNode)) {
    for (let r = 0; r < rowCount; r++) {
      const tableRowCells = targetRowNode.getChildren();
      const tableColumnCount = tableRowCells.length;
      const newTableRowNode = $createTableRowNode();

      for (let c = 0; c < tableColumnCount; c++) {
        const tableCellFromTargetRow = tableRowCells[c];

        if (!$isTableCellNode(tableCellFromTargetRow)) {
          throw Error(`Expected table cell`);
        }

        const { above, below } = $getTableCellSiblingsFromTableCellNode(tableCellFromTargetRow, grid);
        let headerState = TableCellHeaderStates.NO_STATUS;
        const width = (above && above.getWidth()) || (below && below.getWidth()) || null;

        if (
          (above && above.hasHeaderState(TableCellHeaderStates.COLUMN)) ||
          (below && below.hasHeaderState(TableCellHeaderStates.COLUMN))
        ) {
          headerState |= TableCellHeaderStates.COLUMN;
        }

        const tableCellNode = $createTableCellNode(headerState, 1, width);

        tableCellNode.append(lexical.$createParagraphNode());
        newTableRowNode.append(tableCellNode);
      }

      if (shouldInsertAfter) {
        targetRowNode.insertAfter(newTableRowNode);
      } else {
        targetRowNode.insertBefore(newTableRowNode);
      }
    }
  } else {
    throw new Error('Row before insertion index does not exist.');
  }

  return tableNode;
}
function $insertTableColumn(tableNode, targetIndex, shouldInsertAfter = true, columnCount) {
  const tableRows = tableNode.getChildren();

  for (let r = 0; r < tableRows.length; r++) {
    const currentTableRowNode = tableRows[r];

    if ($isTableRowNode(currentTableRowNode)) {
      for (let c = 0; c < columnCount; c++) {
        let headerState = TableCellHeaderStates.NO_STATUS;

        if (r === 0) {
          headerState |= TableCellHeaderStates.ROW;
        }

        const newTableCell = $createTableCellNode(headerState);

        newTableCell.append(lexical.$createParagraphNode());
        const tableRowChildren = currentTableRowNode.getChildren();

        if (targetIndex >= tableRowChildren.length || targetIndex < 0) {
          throw new Error('Table column target index out of range');
        }

        const targetCell = tableRowChildren[targetIndex];

        if (shouldInsertAfter) {
          targetCell.insertAfter(newTableCell);
        } else {
          targetCell.insertBefore(newTableCell);
        }
      }
    }
  }

  return tableNode;
}
function $deleteTableColumn(tableNode, targetIndex) {
  const tableRows = tableNode.getChildren();

  for (let i = 0; i < tableRows.length; i++) {
    const currentTableRowNode = tableRows[i];

    if ($isTableRowNode(currentTableRowNode)) {
      const tableRowChildren = currentTableRowNode.getChildren();

      if (targetIndex >= tableRowChildren.length || targetIndex < 0) {
        throw new Error('Table column target index out of range');
      }

      tableRowChildren[targetIndex].remove();
    }
  }

  return tableNode;
}

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
const INSERT_TABLE_COMMAND = lexical.createCommand();

export { $createTableCellNode };
export { $createTableNode };
export { $createTableNodeWithDimensions };
export { $createTableRowNode };
export { $deleteTableColumn };
export { $getElementGridForTableNode };
export { $getTableCellNodeFromLexicalNode };
export { $getTableColumnIndexFromTableCellNode };
export { $getTableNodeFromLexicalNodeOrThrow };
export { $getTableRowIndexFromTableCellNode };
export { $getTableRowNodeFromTableCellNodeOrThrow };
export { $insertTableColumn };
export { $insertTableRow };
export { $isTableCellNode };
export { $isTableNode };
export { $isTableRowNode };
export { $removeTableRowAtIndex };
export { INSERT_TABLE_COMMAND };
export { TableCellHeaderStates };
export { TableCellNode };
export { TableNode };
export { TableRowNode };
export { TableSelection };
export { applyTableHandlers };
export { getCellFromTarget };
export { getTableSelectionFromTableElement };

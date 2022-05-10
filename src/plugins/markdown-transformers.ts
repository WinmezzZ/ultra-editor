import type { ElementNode, LexicalNode } from 'lexical';

import { CHECK_LIST, ELEMENT_TRANSFORMERS, TEXT_FORMAT_TRANSFORMERS, TEXT_MATCH_TRANSFORMERS } from '@lexical/markdown';
import { $createHorizontalRuleNode, $isHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $createTableCellNode,
  $createTableNode,
  $createTableRowNode,
  $isTableNode,
  $isTableRowNode,
  TableCellHeaderStates,
  TableCellNode,
} from '@lexical/table';
import { $createParagraphNode, $createTextNode, $isElementNode, $isParagraphNode, $isTextNode } from 'lexical';

import { $createEquationNode, $isEquationNode } from '../nodes/equation-node';
import { $createImageNode, $isImageNode } from '../nodes/image-node';

export const HR = {
  export: (node: LexicalNode) => {
    return $isHorizontalRuleNode(node) ? '***' : null;
  },
  regExp: /^(---|\*\*\*|___)\s?$/,
  replace: (parentNode, _1, _2, isImport) => {
    const line = $createHorizontalRuleNode();

    if (isImport || parentNode.getNextSibling() != null) {
      parentNode.replace(line);
    } else {
      parentNode.insertBefore(line);
    }

    line.selectNext();
  },
  type: 'element',
};

export const IMAGE = {
  export: (node, _exportChildren, _exportFormat) => {
    if (!$isImageNode(node)) {
      return null;
    }

    return `![${node.getAltText()}](${node.getSrc()})`;
  },
  importRegExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))/,
  regExp: /!(?:\[([^[]*)\])(?:\(([^(]+)\))$/,
  replace: (textNode, match) => {
    const [, altText, src] = match;
    const imageNode = $createImageNode(src, altText, 800);

    textNode.replace(imageNode);
  },
  trigger: ')',
  type: 'text-match',
};

export const EQUATION = {
  export: (node, _exportChildren, _exportFormat) => {
    if (!$isEquationNode(node)) {
      return null;
    }

    return `$${node.getEquation()}$`;
  },
  importRegExp: /\$([^$].+?)\$/,
  regExp: /\$([^$].+?)\$$/,
  replace: (textNode, match) => {
    const [, equation] = match;
    const equationNode = $createEquationNode(equation, true);

    textNode.replace(equationNode);
  },
  trigger: '$',
  type: 'text-match',
};

const TABLE_ROW_REG_EXP = /^(?:\|)(.+)(?:\|)\s?$/;

export const TABLE = {
  export: (node: LexicalNode, exportChildren: (elementNode: ElementNode) => string) => {
    if (!$isTableNode(node)) {
      return null;
    }

    const output = [];

    for (const row of node.getChildren()) {
      const rowOutput = [];

      if ($isTableRowNode(row)) {
        for (const cell of row.getChildren()) {
          if ($isElementNode(cell)) {
            rowOutput.push(exportChildren(cell));
          }
        }
      }

      output.push(`| ${rowOutput.join(' | ')} |`);
    }

    return output.join('\n');
  },
  regExp: TABLE_ROW_REG_EXP,
  replace: (parentNode, _1, match) => {
    const matchCells = mapToTableCells(match[0]);

    if (matchCells == null) {
      return;
    }

    const rows = [matchCells];
    let sibling = parentNode.getPreviousSibling();
    let maxCells = matchCells.length;

    while (sibling) {
      if (!$isParagraphNode(sibling)) {
        break;
      }

      if (sibling.getChildrenSize() !== 1) {
        break;
      }

      const firstChild = sibling.getFirstChild();

      if (!$isTextNode(firstChild)) {
        break;
      }

      const cells = mapToTableCells(firstChild.getTextContent());

      if (cells == null) {
        break;
      }

      maxCells = Math.max(maxCells, cells.length);
      rows.unshift(cells);
      const previousSibling = sibling.getPreviousSibling();

      sibling.remove();
      sibling = previousSibling;
    }

    const table = $createTableNode();

    for (const cells of rows) {
      const tableRow = $createTableRowNode();

      table.append(tableRow);

      for (let i = 0; i < maxCells; i++) {
        tableRow.append(i < cells.length ? cells[i] : createTableCell());
      }
    }

    parentNode.replace(table);
    table.selectEnd();
  },
  type: 'element',
};

const createTableCell = (textContent?: string | null | undefined): TableCellNode => {
  const cell = ($createTableCellNode as any)(TableCellHeaderStates.NO_STATUS);
  const paragraph = $createParagraphNode();

  if (textContent != null) {
    paragraph.append($createTextNode(textContent.trim()));
  }

  cell.append(paragraph);

  return cell;
};

const mapToTableCells = (textContent: string): Array<TableCellNode> | null => {
  const match = textContent.match(TABLE_ROW_REG_EXP);

  if (!match || !match[1]) {
    return null;
  }

  return match[1].split('|').map(text => createTableCell(text));
};

export const UlTRA_TRANSFORMERS: Array<Transformer> = [
  TABLE,
  HR,
  IMAGE,
  EQUATION,
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

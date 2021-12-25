import React from 'react';
import { Code, ListTwo, Quote, OrderedList } from '@icon-park/react';

type CoreDraftBlockType = 'unordered-list-item' | 'ordered-list-item' | 'blockquote' | 'code-block';

interface BlockItem {
  title: React.ReactNode;
  style: CoreDraftBlockType;
  label: React.ReactNode;
}

export const BLOCK_STYLES: BlockItem[] = [
  { title: 'Blockquote', style: 'blockquote', label: <Quote /> },
  { title: 'UL', style: 'unordered-list-item', label: <OrderedList /> },
  { title: 'OL', style: 'ordered-list-item', label: <ListTwo /> },
  { title: 'Code Block', style: 'code-block', label: <Code /> },
];

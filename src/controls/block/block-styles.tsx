import React from 'react';
import { Code, Quote } from '@icon-park/react';
import { OrderedList, UnorderedList } from '@icon-park/react';

type CoreDraftBlockType = 'unordered-list-item' | 'ordered-list-item' | 'blockquote' | 'code-block';

interface BlockItem {
  title: React.ReactNode;
  style: CoreDraftBlockType;
  label: React.ReactNode;
}

export const BLOCK_STYLES: BlockItem[] = [
  { title: 'Blockquote', style: 'blockquote', label: <Quote /> },
  { title: 'UL', style: 'unordered-list-item', label: <UnorderedList /> },
  { title: 'OL', style: 'ordered-list-item', label: <OrderedList /> },
  { title: 'Code Block', style: 'code-block', label: <Code /> },
];

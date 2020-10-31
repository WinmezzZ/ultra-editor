import React from 'react';
import { createFromIconfontCN, CodeOutlined, UnorderedListOutlined, OrderedListOutlined } from '@ant-design/icons';

const QuoteIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2170513_9bldeta7kz6.js',
});

type CoreDraftBlockType = 'unordered-list-item' | 'ordered-list-item' | 'blockquote' | 'code-block';

interface BlockItem {
  title: React.ReactNode;
  style: CoreDraftBlockType;
  label: React.ReactNode;
}

export const BLOCK_STYLES: BlockItem[] = [
  { title: 'Blockquote', style: 'blockquote', label: <QuoteIcon type="icon-TextQuote-1" /> },
  { title: 'UL', style: 'unordered-list-item', label: <UnorderedListOutlined /> },
  { title: 'OL', style: 'ordered-list-item', label: <OrderedListOutlined /> },
  { title: 'Code Block', style: 'code-block', label: <CodeOutlined /> },
];

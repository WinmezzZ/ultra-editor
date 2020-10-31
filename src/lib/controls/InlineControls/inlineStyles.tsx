import React from 'react';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, StrikethroughOutlined } from '@ant-design/icons';
import { DraftInlineStyleType } from 'draft-js';

interface InlineItem {
  title: string;
  style: DraftInlineStyleType;
  label: React.ReactNode;
}

export const INLINE_STYLES: InlineItem[] = [
  { title: 'Bold', style: 'BOLD', label: <BoldOutlined /> },
  { title: 'Italic', style: 'ITALIC', label: <ItalicOutlined /> },
  { title: 'Underline', style: 'UNDERLINE', label: <UnderlineOutlined /> },
  { title: 'Strikethrough', style: 'STRIKETHROUGH', label: <StrikethroughOutlined /> },
  { title: 'Monospace', style: 'CODE', label: <span>&lt;&gt;</span> },
];

import React from 'react';
import { DraftInlineStyleType } from 'draft-js';
import { Strikethrough, TextBold, TextItalic, TextUnderline } from '@icon-park/react';

interface InlineItem {
  title: string;
  style: DraftInlineStyleType;
  label: React.ReactNode;
}

export const INLINE_STYLES: InlineItem[] = [
  { title: 'Bold', style: 'BOLD', label: <TextBold /> },
  { title: 'Italic', style: 'ITALIC', label: <TextItalic /> },
  { title: 'Underline', style: 'UNDERLINE', label: <TextUnderline /> },
  { title: 'Strikethrough', style: 'STRIKETHROUGH', label: <Strikethrough /> },
  { title: 'Monospace', style: 'CODE', label: <span>&lt;&gt;</span> },
];

import React from 'react';
import { UndoOutlined, RedoOutlined } from '@ant-design/icons';

export interface UndoRedoItem {
  title: string;
  style: 'undo' | 'redo';
  label: React.ReactNode;
}

export const UNDO_REDO_STYLES: UndoRedoItem[] = [
  { title: 'Undo', style: 'undo', label: <UndoOutlined /> },
  { title: 'Redo', style: 'redo', label: <RedoOutlined /> },
];

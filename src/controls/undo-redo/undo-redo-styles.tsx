import { Redo, Undo } from '@icon-park/react';

export interface UndoRedoItem {
  title: string;
  style: 'undo' | 'redo';
  label: React.ReactNode;
}

export const UNDO_REDO_STYLES: UndoRedoItem[] = [
  { title: 'Undo', style: 'undo', label: <Undo /> },
  { title: 'Redo', style: 'redo', label: <Redo /> },
];

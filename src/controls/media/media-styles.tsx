import { Picture, Video } from '@icon-park/react';
import { MediaType } from '..';

export interface MediaItem {
  title: string;
  style: MediaType;
  label: React.ReactNode;
}

export const MEDIA_STYLES: MediaItem[] = [
  { title: 'IMAGE', style: 'IMAGE', label: <Picture /> },
  { title: 'Video', style: 'VIDEO', label: <Video /> },
];

import React from 'react';
import { createFromIconfontCN } from '@ant-design/icons';

const CustomIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2170513_rg9er7j6vn.js',
});

export const HeaderIcon = () => {
  return <CustomIcon type="" />;
};

export type CoreDraftHeaderType =
  | 'header-one'
  | 'header-two'
  | 'header-three'
  | 'header-four'
  | 'header-five'
  | 'header-six'
  | 'unstyled';

interface HeaderItem {
  title: string;
  style: CoreDraftHeaderType;
}

export const HEADER_STYLES: HeaderItem[] = [
  { title: 'H1', style: 'header-one' },
  { title: 'H2', style: 'header-two' },
  { title: 'H3', style: 'header-three' },
  { title: 'H4', style: 'header-four' },
  { title: 'H5', style: 'header-five' },
  { title: 'H6', style: 'header-six' },
  { title: 'Regular', style: 'unstyled' },
];

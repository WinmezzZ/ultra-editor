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

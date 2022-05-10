import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { FC } from 'react';

import { UlTRA_TRANSFORMERS } from './markdown-transformers';

const MarkdownPlugin: FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <LexicalMarkdownShortcutPlugin transformers={UlTRA_TRANSFORMERS} />;
};

export default MarkdownPlugin;

import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { FC } from 'react';

import { PLAYGROUND_TRANSFORMERS } from './markdown-transformers';

const MarkdownPlugin: FC = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <LexicalMarkdownShortcutPlugin transformers={PLAYGROUND_TRANSFORMERS} />;
};

export default MarkdownPlugin;

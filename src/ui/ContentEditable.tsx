import './ContentEditable.css';

import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

export default function ContentEditable({ className }: { className?: string }): React.ReactNode {
  return <LexicalContentEditable className={className || 'ContentEditable__root'} />;
}

import './ContentEditable.css';

import LexicalContentEditable from '@lexical/react/LexicalContentEditable';

export default function ContentEditable({ className }: { className?: string }) {
  return <LexicalContentEditable className={className || 'ContentEditable__root'} />;
}

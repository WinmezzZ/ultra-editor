import './Placeholder.css';

import * as React from 'react';

export default function Placeholder({
  children,
  className,
}: {
  children: string;
  className?: string;
}): React.ReactNode {
  return <div className={className || 'Placeholder__root'}>{children}</div>;
}

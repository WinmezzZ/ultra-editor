// $FlowFixMe
import katex from 'katex';
import * as React from 'react';
import { useEffect, useRef } from 'react';

export default function KatexRenderer({
  equation,
  inline,
  onClick,
}: Readonly<{
  equation: string;
  inline: boolean;
  onClick: () => void;
}>): React.ReactNode {
  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline, // true === block display //
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return <span role="button" tabIndex={-1} onClick={onClick} ref={katexElementRef} />;
}

import './EquationEditor.css';

import React, { useCallback } from 'react';

type BaseEquationEditorProps = {
  equation: string;
  inline: boolean;
  inputRef: { current: null | HTMLElement };
  setEquation: (x: string) => void;
};

export default function EquationEditor({
  equation,
  setEquation,
  inline,
  inputRef,
}: BaseEquationEditorProps): React.ReactNode {
  const onChange = useCallback(
    event => {
      setEquation(event.target.value);
    },
    [setEquation],
  );

  const props = {
    equation,
    inputRef,
    onChange,
  };

  return inline ? <InlineEquationEditor {...props} /> : <BlockEquationEditor {...props} />;
}

type EquationEditorImplProps = {
  equation: string;
  inputRef: { current: null | HTMLElement };
  onChange: (e: React.SyntheticEvent<HTMLInputElement>) => void;
};

function InlineEquationEditor({ equation, onChange, inputRef }: EquationEditorImplProps): React.ReactNode {
  return (
    <span className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">$</span>
      <input
        className="EquationEditor_inlineEditor"
        value={equation}
        onChange={onChange}
        autoFocus={true}
        ref={inputRef}
      />
      <span className="EquationEditor_dollarSign">$</span>
    </span>
  );
}

function BlockEquationEditor({ equation, onChange, inputRef }: EquationEditorImplProps): React.ReactNode {
  return (
    <div className="EquationEditor_inputBackground">
      <span className="EquationEditor_dollarSign">{'$$\n'}</span>
      <textarea className="EquationEditor_blockEditor" value={equation} onChange={onChange} ref={inputRef} />
      <span className="EquationEditor_dollarSign">{'\n$$'}</span>
    </div>
  );
}

import './Input.css';

import * as React from 'react';

type Props = Readonly<{
  label: string;
  onChange: (v: string) => void;
  placeholder?: string;
  value: string;
}>;

export default function Input({ label, value, onChange, placeholder = '' }: Props): React.ReactNode {
  return (
    <div className="Input__wrapper">
      <label className="Input__label">{label}</label>
      <input
        type="text"
        className="Input__input"
        placeholder={placeholder}
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}

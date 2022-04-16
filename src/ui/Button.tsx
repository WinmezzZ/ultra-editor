import './Button.css';

import * as React from 'react';

import joinClasses from '../utils/join-classes';

export default function Button({
  children,
  onClick,
  disabled,
  small,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={joinClasses('Button__root', disabled && 'Button__disabled', small && 'Button__small')}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

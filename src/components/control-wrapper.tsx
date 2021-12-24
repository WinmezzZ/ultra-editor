import React, { FC } from 'react';
import { Button, Tooltip } from 'ultra-design';

interface ControlContainerProps {
  active?: boolean;
  disabled?: boolean;
  title: React.ReactNode;
  onToggle: (e: React.MouseEvent) => void;
}

const ControlWrapper: FC<ControlContainerProps> = props => {
  const { disabled, active, children, title, onToggle } = props;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onToggle(e);
  };

  return (
    <Tooltip title={title} placement="top">
      <Button disabled={disabled} type={active ? 'primary' : 'default'} onClick={handleClick}>
        {children}
      </Button>
    </Tooltip>
  );
};

export default ControlWrapper;

import React, { FC } from 'react';
import { Button, Tooltip } from 'antd';

interface ControlContainerProps {
  active?: boolean;
  disabled?: boolean;
  title: React.ReactNode;
  onToggle: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
}

const ControlContainer: FC<ControlContainerProps> = props => {
  const { disabled, active, children, title, onToggle } = props;

  const onMouseDown = (e: React.MouseEvent<any, MouseEvent>) => {
    e.preventDefault();
    onToggle(e);
  };

  return (
    <Tooltip title={title} placement="top">
      <Button disabled={disabled} type={active ? 'primary' : 'default'} onMouseDown={onMouseDown}>
        {children}
      </Button>
    </Tooltip>
  );
};

export default ControlContainer;

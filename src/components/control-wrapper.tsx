import React from 'react';
import { Button, Tooltip } from 'ultra-design';

interface ControlContainerProps {
  active?: boolean;
  disabled?: boolean;
  title: React.ReactNode;
  onToggle: (e: React.MouseEvent) => void;
  tooltip?: boolean;
}

const ControlWrapperComponent: React.ForwardRefRenderFunction<any, React.PropsWithChildren<ControlContainerProps>> = (
  props,
  ref,
) => {
  const { disabled, active, children, title, onToggle, tooltip } = props;

  const handleClick = (e: React.MouseEvent) => {
    onToggle(e);
  };

  return tooltip ? (
    <Tooltip title={title} placement="top">
      <Button ref={ref} disabled={disabled} type={active ? 'primary' : 'default'} onClick={handleClick}>
        {children}
      </Button>
    </Tooltip>
  ) : (
    <Button ref={ref} disabled={disabled} type={active ? 'primary' : 'default'} onClick={handleClick}>
      {children}
    </Button>
  );
};

const ControlWrapper = React.forwardRef(ControlWrapperComponent);

ControlWrapper.defaultProps = {
  tooltip: true,
};

export default ControlWrapper;

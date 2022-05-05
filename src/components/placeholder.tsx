import { css } from '@emotion/react';
import { FC } from 'react';

interface PlaceholderProps {
  className?: string;
}

const Placeholder: FC<PlaceholderProps> = ({ className }) => {
  return (
    <div css={!className && placeholderStyle} className={className || 'Placeholder__root'}>
      请输入...
    </div>
  );
};

export default Placeholder;

const placeholderStyle = css`
  font-size: 15px;
  color: #999;
  overflow: hidden;
  position: absolute;
  text-overflow: ellipsis;
  top: 10px;
  left: 10px;
  user-select: none;
  white-space: nowrap;
  display: inline-block;
  pointer-events: none;
`;

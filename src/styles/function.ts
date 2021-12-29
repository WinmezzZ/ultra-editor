import { css } from '@emotion/react';

export const layerItems = () => css`
  > * {
    cursor: pointer;
    margin-right: 12px;
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    :hover {
      background-color: #f5f5f5;
      border-radius: 6px;
    }
    &::nth-last-of-type() {
      margin-right: 0;
    }
  }
`;

const styleFunctions = {
  layerItems,
};

export default styleFunctions;

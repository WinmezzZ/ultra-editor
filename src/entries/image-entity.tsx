import { css, SerializedStyles } from '@emotion/react';
import { AlignTextLeft, AlignTextCenter, AlignTextRight, AlignTextBoth } from '@icon-park/react';
import React, { FC, useState } from 'react';
import { Popover, Tooltip } from 'ultra-design';
import { CommonProps, imageEditLayerStyle } from './media-entry';

type Alignment = 'left' | 'center' | 'right' | 'side';

const alignmentStyleMap: Record<Alignment, SerializedStyles> = {
  left: css`
    text-align: left;
  `,
  center: css`
    text-align: center;
  `,
  right: css`
    text-align: right;
  `,
  side: css`
    img {
      width: 100%auto;
    }
  `,
};

const ImageEntity: FC<CommonProps> = ({ src }) => {
  if (!src) return null;
  const [alignment, setAlignment] = useState<Alignment>('left');

  return (
    <div css={imageEntryStyles}>
      <div css={[alignmentStyleMap[alignment]]}>
        <Popover
          trigger="hover"
          showArrow={false}
          content={
            <div css={imageEditLayerStyle}>
              <Tooltip placement="top" title="居左对齐">
                <AlignTextLeft onClick={() => setAlignment('left')} />
              </Tooltip>
              <Tooltip placement="top" title="居中对齐">
                <AlignTextCenter onClick={() => setAlignment('center')} />
              </Tooltip>
              <Tooltip placement="top" title="居右对齐">
                <AlignTextRight onClick={() => setAlignment('right')} />
              </Tooltip>
              <Tooltip placement="top" title="两端对齐">
                <AlignTextBoth onClick={() => setAlignment('side')} />
              </Tooltip>
            </div>
          }
          offset={0}
        >
          <div className="ue-image-edit-wrapper">
            <img src={src} />
          </div>
        </Popover>
      </div>
      <figcaption placeholder="输入图片描述" className="UltraEditor-image-intro"></figcaption>
    </div>
  );
};

const imageEntryStyles = css`
  .ue-image-edit-wrapper {
    border: 2px solid transparent;
    :hover {
      border: 2px solid #13c2c2;
    }
  }
  .UltraEditor-image-intro {
    height: 20px;
  }
`;

export default ImageEntity;

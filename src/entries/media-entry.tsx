import { FC } from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import { ENTITY_TYPE } from '../config/constans';
import { css } from '@emotion/react';

interface CommonProps {
  src: string;
}

// const imageIntro = 'add image introduce';

const Image: FC<CommonProps> = ({ src }) => {
  if (!src) return null;

  return (
    <div css={imageEntryStyles}>
      <div>
        <img src={src} />
      </div>
      <figcaption placeholder="输入图片描述" className="UltraEditor-image-intro"></figcaption>
    </div>
  );
};

const imageEntryStyles = css`
  .UltraEditor-image-intro {
    height: 20px;
  }
`;

const Audio: FC<CommonProps> = ({ src }) => {
  if (!src) return null;

  return <audio src={src} />;
};

const Video: FC<CommonProps> = ({ src }) => {
  if (!src) return null;

  return <video src={src} />;
};

interface MediaEntityProps {
  contentState: ContentState;
  block: ContentBlock;
}

const MediaEntity: FC<MediaEntityProps> = props => {
  const { contentState, block } = props;
  const entity = contentState.getEntity(block.getEntityAt(0));
  const data = entity.getData();
  const type = entity.getType();

  switch (type) {
    case ENTITY_TYPE.IMAGE:
      return <Image src={data.src} />;
    case ENTITY_TYPE.AUDIO:
      return <Audio src={data.src} />;
    case ENTITY_TYPE.VIDEO:
      return <Video src={data.src} />;
    default:
      return null;
  }
};

export default MediaEntity;

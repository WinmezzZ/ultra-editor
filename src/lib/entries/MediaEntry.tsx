import React, { FC } from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import { ENTITY_TYPE } from 'lib/config/constant';

interface CommonProps {
  src: string;
}

const Image: FC<CommonProps> = ({ src }) => {
  if (!src) return null;
  return <img src={src} alt={src} />;
};

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

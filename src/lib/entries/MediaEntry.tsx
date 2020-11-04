import React, { FC } from 'react';
import { ContentState } from 'draft-js';

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
  entityKey: string;
}

const MediaEntity: FC<MediaEntityProps> = props => {
  const { contentState, entityKey } = props;
  console.log(props);
  const entity = contentState.getEntity(entityKey);
  const data = entity.getData();
  const type = entity.getType();

  switch (type) {
    case 'image':
      return <Image src={data.src} />;
    case 'audio':
      return <Audio src={data.src} />;
    case 'video':
      return <Video src={data.src} />;
    default:
      return null;
  }
};

export default MediaEntity;

import { ContentState } from 'draft-js';
import React, { FC } from 'react';

interface LinkEntryProps {
  contentState: ContentState;
  entityKey: string;
}

const LinkEntry: FC<LinkEntryProps> = ({ contentState, entityKey }) => {
  console.log(contentState, entityKey);
  const data = contentState.getEntity(entityKey).getData();
  const { label, url } = data;

  return <a href={url}>{label}</a>;
};

export default LinkEntry;

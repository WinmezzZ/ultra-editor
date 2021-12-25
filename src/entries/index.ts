import { CompositeDecorator } from 'draft-js';
import LinkEntry, { findLinkEntities } from './link-entry';

export const decorator = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkEntry,
  },
]);

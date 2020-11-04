import { CompositeDecorator } from 'draft-js';
import LinkEntry from 'lib/entries/LinkEntry';
import MediaEntity from 'lib/entries/MediaEntry';
import { createTypeStrategy } from 'lib/util/createTypeStrategy';

const decorator = new CompositeDecorator([
  {
    strategy: createTypeStrategy('LINK'),
    component: LinkEntry,
  },
  {
    strategy: createTypeStrategy('IMAGE'),
    component: MediaEntity,
  },
  {
    strategy: createTypeStrategy('AUDIO'),
    component: MediaEntity,
  },
  {
    strategy: createTypeStrategy('VIDEO'),
    component: MediaEntity,
  },
]);

export default decorator;

import { CompositeDecorator } from 'draft-js';
import LinkEntry from 'lib/entries/LinkEntry';
import { createTypeStrategy } from 'lib/util/createTypeStrategy';

const decorator = new CompositeDecorator([
  {
    strategy: createTypeStrategy('LINK'),
    component: LinkEntry,
  },
]);

export default decorator;

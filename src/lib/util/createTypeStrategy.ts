import { ContentBlock, ContentState } from 'draft-js';
import { ENTITY_TYPE } from 'lib/config/constant';

export function createTypeStrategy(type: keyof typeof ENTITY_TYPE) {
  return (contentBlock: ContentBlock, callback: (start: number, end: number) => void, contentState: ContentState) => {
    contentBlock.findEntityRanges(character => {
      const entityKey = character.getEntity();
      return entityKey !== null && contentState.getEntity(entityKey).getType() === type;
    }, callback);
  };
}

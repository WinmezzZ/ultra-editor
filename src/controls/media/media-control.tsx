import { FC } from 'react';
import ControlContainer from '../../components/control-wrapper';
import { ENTITY_TYPE } from '../../config/constans';
import { insertAtomicBlock } from '../../utils/insertAtomicBlock';
import { useEditContext } from '../../utils/useEditorContext';
import { MEDIA_STYLES } from './media-styles';

const MediaControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();

  const onSelectPicture = (type: keyof typeof ENTITY_TYPE) => {
    const url = window.prompt('Enter your image url', 'https://cdn.hyyar.com/avator.png');
    const newEditorState = insertAtomicBlock(editorState, type, 'IMMUTABLE', {
      src: url,
    });

    setEditorState(newEditorState);
  };

  return (
    <>
      {MEDIA_STYLES.map(media => (
        <ControlContainer key={media.style} title={media.title} onToggle={() => onSelectPicture(media.style)}>
          {media.label}
        </ControlContainer>
      ))}
    </>
  );
};

export default MediaControl;

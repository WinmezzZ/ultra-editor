import { FC } from 'react';
import ControlWrapper from '../../components/control-wrapper';
import { BlOCK_TYPE } from '../../config/constans';
import { Minus } from '@icon-park/react';
import { useEditContext } from '../../utils/useEditorContext';
import { insertCustomBlock } from '../../utils/insertCustomBlock';

const HRControl: FC = () => {
  const { editorState, setEditorState } = useEditContext();

  const onSelectPicture = () => {
    const newEditorState = insertCustomBlock(editorState, BlOCK_TYPE.HR);

    setEditorState(newEditorState);
  };

  return (
    <>
      <ControlWrapper title="Divider" onToggle={onSelectPicture}>
        <Minus />
      </ControlWrapper>
    </>
  );
};

export default HRControl;

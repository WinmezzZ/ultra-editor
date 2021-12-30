import React, { FC, useMemo } from 'react';
import ControlWrapper from '../../components/control-wrapper';
import { useEditContext } from '../../utils/useEditorContext';
import { Link } from '@icon-park/react';
import { isCursorBetweenLink } from '../../utils/isCursorBetweenLink';

const LinkControl: FC = () => {
  const { editorState, setLinkModalVisible } = useEditContext();

  const onShowLinkModalVisible = (e: React.MouseEvent) => {
    e.preventDefault();

    setLinkModalVisible(true);
  };

  const disabledLink = useMemo(() => {
    const isBetweenLink = isCursorBetweenLink(editorState);

    if (!isBetweenLink) return false;

    const { entityKey } = isBetweenLink;

    if (entityKey === null) {
      return false;
    }

    return true;
  }, [editorState]);

  return (
    <ControlWrapper title="Link" disabled={disabledLink} onToggle={onShowLinkModalVisible}>
      <Link />
    </ControlWrapper>
  );
};

export default LinkControl;

import React, { FC, useState } from 'react';
import { Menu, Dropdown, Button } from 'antd';
import { RichUtils } from 'draft-js';
import { HEADER_STYLES, CoreDraftHeaderType } from './headerStyles';
import { useContext } from 'react';
import { EditorStore } from 'lib/store';

const HeaderControls: FC = () => {
  const { editorState, setEditorState } = useContext(EditorStore);
  const [currentHeader, setCurrentHeader] = useState<CoreDraftHeaderType>('unstyled');

  const currentHeaderName = HEADER_STYLES.find(header => header.style === currentHeader)?.title;
  const onSelect = (key: CoreDraftHeaderType, domEvent: React.MouseEvent<HTMLElement>) => {
    domEvent.preventDefault();
    setCurrentHeader(key);
    setEditorState(RichUtils.toggleBlockType(editorState, key));
  };

  const createElement = (title: string) => {
    const t = title.toLocaleLowerCase();
    return t.includes('h') ? React.createElement(t, null, title) : title;
  };

  return (
    <Dropdown
      placement="bottomCenter"
      trigger={['click']}
      overlay={
        <Menu onClick={({ key, domEvent }: any) => onSelect(key, domEvent)} selectedKeys={[currentHeader]}>
          {HEADER_STYLES.map(header => {
            return <Menu.Item key={header.style}>{createElement(header.title)}</Menu.Item>;
          })}
        </Menu>
      }
    >
      <Button>{currentHeaderName}</Button>
    </Dropdown>
  );
};

export default HeaderControls;

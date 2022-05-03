import { css } from '@emotion/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FC, useState, useRef } from 'react';
import { Toast, Modal, Tabs, Upload, Button, Input } from 'ultra-design';
import { UploadRef } from 'ultra-design/es/upload/upload';
import { InsertImagePayload, INSERT_IMAGE_COMMAND } from '../ImagesPlugin';

interface InsertImageDialogProps {
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
}

const InsetImageDialog: FC<InsertImageDialogProps> = props => {
  const { visible, onVisibleChange } = props;
  const [editor] = useLexicalComposerContext();
  const [currentTab, setCurrentTab] = useState('local');
  const localUploadRef = useRef<UploadRef>();
  const removeUrlRef = useRef<HTMLInputElement>();

  const onSubmitImage = () => {
    if (currentTab === 'remote') {
      const removeUrl = removeUrlRef.current.value;

      if (!removeUrl) {
        return removeUrlRef.current.focus();
      }
      insertImage([{ src: removeUrl, altText: '' }]);
    } else if (currentTab === 'local') {
      const imageList = localUploadRef.current.imageList;

      if (!imageList.length) {
        return Toast.warning('请上传图片');
      }
      insertImage(imageList.map(img => ({ src: img.url, altText: '' })));
    }
  };

  const insertImage = (payloads: InsertImagePayload[]) => {
    payloads.forEach(payload => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    });

    onVisibleChange(false);
  };

  return (
    <Modal
      css={insetImageDialogStyles}
      visible={visible}
      onClose={() => onVisibleChange(false)}
      onOk={onSubmitImage}
      title="插入图片"
    >
      <Tabs value={currentTab} onChange={tab => setCurrentTab(tab)}>
        <Tabs.Item label="本地图片" value="local">
          <Upload ref={localUploadRef} />
          <Button type="primary" className="start-upload-btn">
            开始上传
          </Button>
        </Tabs.Item>
        <Tabs.Item label="远程链接" value="remote">
          <Input
            ref={removeUrlRef}
            placeholder="请输入图片地址"
            defaultValue="https://static01.imgkr.com/temp/f23eb233e5ec4822a62d98593dd6ece8.png"
          />
        </Tabs.Item>
      </Tabs>
    </Modal>
  );
};

export default InsetImageDialog;

const insetImageDialogStyles = css`
  .start-upload-btn {
    margin-top: 20px;
  }
`;

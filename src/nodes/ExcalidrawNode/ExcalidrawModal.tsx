// $FlowFixMe: node modules are ignored by flow
import './ExcalidrawModal.css';

// $FlowFixMe: Flow doesn't have types for Excalidraw
import Excalidraw from '@excalidraw/excalidraw';
import { useEffect, useRef, useState } from 'react';
import { Button } from 'ultra-design';

type ExcalidrawElementFragment = {
  isDeleted?: boolean;
};

type Props = {
  /**
   * The initial set of elements to draw into the scene
   */
  initialElements: ReadonlyArray<ExcalidrawElementFragment>;
  /**
   * Controls the visibility of the modal
   */
  isShown?: boolean;
  /**
   * Completely remove Excalidraw component
   */
  onDelete: () => boolean;
  /**
   * Handle modal closing
   */
  onHide: () => any;
  /**
   * Callback when the save button is clicked
   */
  onSave: (f: ReadonlyArray<ExcalidrawElementFragment>) => any;
};

/**
 * @explorer-desc
 * A component which renders a modal with Excalidraw (a painting app)
 * which can be used to export an editable image
 */
export default function ExcalidrawModal({ onSave, initialElements, isShown = false, onHide, onDelete }: Props) {
  const excalidrawRef = useRef(null);
  const [elements, setElements] = useState<ReadonlyArray<ExcalidrawElementFragment>>(initialElements);

  const save = () => {
    if (elements.filter(el => !el.isDeleted).length > 0) {
      onSave(elements);
    } else {
      // delete node if the scene is clear
      onDelete();
    }
    onHide();
  };

  const discard = () => {
    if (elements.filter(el => !el.isDeleted).length === 0) {
      // delete node if the scene is clear
      onDelete();
    }
    onHide();
  };

  useEffect(() => {
    excalidrawRef?.current?.updateScene({ elements: initialElements });
  }, [initialElements]);

  if (isShown === false) {
    return null;
  }

  const onChange = els => {
    setElements(els);
  };

  return (
    <div className="ExcalidrawModal__modal">
      <div className="ExcalidrawModal__row">
        <Excalidraw
          langCode="zh-CN"
          onChange={onChange}
          initialData={{
            appState: { isLoading: false },
            elements: initialElements as any,
          }}
        />
        <div className="ExcalidrawModal__actions">
          <Button className="action-button" onClick={discard}>
            撤销
          </Button>
          <Button type="primary" className="action-button" onClick={save}>
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}

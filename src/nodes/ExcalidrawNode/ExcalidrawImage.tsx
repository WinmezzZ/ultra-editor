import { exportToSvg } from '@excalidraw/excalidraw';
import { useEffect, useState } from 'react';

type ImageType = 'svg' | 'canvas';

type Props = {
  /**
   * Configures the export setting for SVG/Canvas
   */
  appState?: any;
  /**
   * The css class applied to image to be rendered
   */
  className?: string;
  /**
   * The Excalidraw elements to be rendered as an image
   */
  elements: ReadonlyArray<any>;
  /**
   * The height of the image to be rendered
   */
  height?: number | null;
  /**
   * The type of image to be rendered
   */
  imageType?: ImageType;
  /**
   * The css class applied to the root element of this component
   */
  rootClassName?: string | null;
  /**
   * The width of the image to be rendered
   */
  width?: number | null;
};

// exportToSvg has fonts from excalidraw.com
// We don't want them to be used in open source
const removeStyleFromSvg_HACK = svg => {
  const styleTag = svg?.firstElementChild?.firstElementChild;

  if (styleTag && styleTag.tagName === 'style') {
    styleTag.remove();
  }
};

/**
 * @explorer-desc
 * A component for rendering Excalidraw elements as a static image
 */
export default function ExcalidrawImage({
  elements,
  className: _className = '',
  height: _height = null,
  width: _width = null,
  appState = null,
  rootClassName = null,
}: Props) {
  const [Svg, setSvg] = useState<Element | null>(null);

  useEffect(() => {
    const setContent = async () => {
      const svg: Element = await exportToSvg({
        appState,
        elements,
        files: null,
      });

      removeStyleFromSvg_HACK(svg);
      setSvg(svg);
    };

    setContent();
  }, [elements, appState]);

  return <div className={rootClassName} dangerouslySetInnerHTML={{ __html: Svg?.outerHTML }} />;
}
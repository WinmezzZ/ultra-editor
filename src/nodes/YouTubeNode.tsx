import type { LexicalNode, NodeKey } from 'lexical';

import { DecoratorNode } from 'lexical';
import * as React from 'react';
import { useEffect, useRef } from 'react';

type YouTubeComponentProps = Readonly<{
  onLoad?: () => void;
  videoID: string;
}>;

function YouTubeComponent({ onLoad, videoID }: YouTubeComponentProps) {
  const previousYouTubeIDRef = useRef(null);

  useEffect(() => {
    if (videoID !== previousYouTubeIDRef.current) {
      if (onLoad) {
        onLoad();
      }

      previousYouTubeIDRef.current = videoID;
    }
  }, [onLoad, videoID]);

  return (
    <iframe
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${videoID}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen={true}
      title="YouTube video"
    />
  );
}

export class YouTubeNode extends DecoratorNode<React.ReactNode> {
  __id: string;

  static getType(): string {
    return 'youtube';
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__id, node.__key);
  }

  constructor(id: string, key?: NodeKey) {
    super(key);

    this.__id = id;
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  decorate() {
    return <YouTubeComponent videoID={this.__id} />;
  }
}

export function $createYouTubeNode(videoID: string): YouTubeNode {
  return new YouTubeNode(videoID);
}

export function $isYouTubeNode(node?: LexicalNode) {
  return node instanceof YouTubeNode;
}

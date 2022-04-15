import LexicalComposer from '@lexical/react/LexicalComposer';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import ContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import Theme from './themes';
import ToolbarPlugin from './plugins/ToolbarPlugin';
// import TreeViewPlugin from './plugins/TreeViewPlugin';
import LinkPlugin from '@lexical/react/LexicalLinkPlugin';
import ListPlugin from '@lexical/react/LexicalListPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import AutoLinkPlugin from './plugins/AutolinkPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import MarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import './index.css';
import PlaygroundNodes from './nodes/PlaygroundNodes';

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

const initialConfig = {
  theme: Theme,
  nodes: PlaygroundNodes,
  onError(error: Error) {
    console.error(error);
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container editor-shell">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <MarkdownShortcutPlugin />
          <ImagesPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}

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
import TablePlugin from './plugins/TablePlugin';
import TableCellResizerPlugin from './plugins/TableCellResizerPlugin';
// import TableActionMenuPlugin from './plugins/TableActionMenuPlugin';
import './index.css';
import PlaygroundNodes from './nodes/PlaygroundNodes';
import CharacterStylesPopupPlugin from './plugins/CharacterStylesPopupPlugin';
import HorizontalRulePlugin from './plugins/HorizontalRulePlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import { css } from '@emotion/react';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import PollPlugin from './plugins/PollPlugin';
import { ConfigProvider } from 'ultra-design';
import zh_CN from 'ultra-design/es/locale/zh_CN';
import ActionsPlugins from './plugins/ActionPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TableActionMenuPlugin from './plugins/TableActionMenuPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import HashtagsPlugin from '@lexical/react/LexicalHashtagPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';

function Placeholder() {
  return (
    <div
      className="Placeholder__root"
      css={css`
        font-size: 15px;
        color: #999;
        overflow: hidden;
        position: absolute;
        text-overflow: ellipsis;
        top: 10px;
        left: 10px;
        user-select: none;
        white-space: nowrap;
        display: inline-block;
        pointer-events: none;
      `}
    >
      请输入...
    </div>
  );
}

const initialConfig = {
  namespace: 'UltraEditor',
  theme: Theme,
  nodes: PlaygroundNodes,
  onError(error: Error) {
    console.error(error);
  },
};

export default function Editor() {
  return (
    <ConfigProvider locale={zh_CN}>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-shell">
          <ToolbarPlugin />

          <div className="editor-container">
            <RichTextPlugin
              contentEditable={<ContentEditable className="ContentEditable__root" />}
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
            <TablePlugin />
            <TableCellResizerPlugin />
            <TableActionMenuPlugin />
            <CharacterStylesPopupPlugin />
            <HorizontalRulePlugin />
            <ExcalidrawPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <PollPlugin />
            {/* <TreeViewPlugin /> */}
            <MentionsPlugin />
            <ActionsPlugins />
            <SpeechToTextPlugin />
            <HashtagsPlugin />
            <EmojisPlugin />
          </div>
        </div>
      </LexicalComposer>
    </ConfigProvider>
  );
}

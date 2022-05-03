import LexicalComposer from '@lexical/react/LexicalComposer';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
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
import TablePlugin from '@lexical/react/LexicalTablePlugin';
import TableCellResizerPlugin from './plugins/TableCellResizerPlugin';
// import TableActionMenuPlugin from './plugins/TableActionMenuPlugin';
import './index.css';
import NodeList from './nodes/PlaygroundNodes';

// import CharacterStylesPopupPlugin from './plugins/CharacterStylesPopupPlugin';
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
import ClickableLinkPlugin from './plugins/ClickableLinkPlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import ContentEditable from './components/content-editable';
import Placeholder from './components/placeholder';

const initialConfig = {
  theme: Theme,
  nodes: NodeList,
  onError: (error: Error) => {
    console.error(error);
  },
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ConfigProvider locale={zh_CN}>
        <div className="UltraEditor-root" css={rootEditorStyle}>
          <ToolbarPlugin />

          <div className="UltraEditor-container">
            <RichTextPlugin contentEditable={<ContentEditable />} placeholder={<Placeholder />} />
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
            {/* <CharacterStylesPopupPlugin /> */}
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
            <ClickableLinkPlugin />
            <KeywordsPlugin />
          </div>
        </div>
      </ConfigProvider>
    </LexicalComposer>
  );
}

const rootEditorStyle = css`
  margin: 20px auto;
  border-radius: 2px;
  max-width: 1000px;
  color: #000;
  position: relative;
  line-height: 20px;
  font-weight: 400;

  .UltraEditor-container {
    background: #fff;
    position: relative;
    cursor: text;
    display: block;
  }

  span.UltraEditor__image {
    cursor: default;
    display: inline-block;
    position: relative;
    img {
      max-width: 100%;
    }

    img.focused {
      outline: 2px solid rgb(60, 132, 244);
      user-select: none;
    }
  }
`;

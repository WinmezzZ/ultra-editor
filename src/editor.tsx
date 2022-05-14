import LexicalComposer from '@lexical/react/LexicalComposer';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import Theme from './themes';
import ToolbarPlugin from './plugins/toolbar-plugin';
// import TreeViewPlugin from './plugins/TreeViewPlugin';
import LinkPlugin from '@lexical/react/LexicalLinkPlugin';
import ListPlugin from '@lexical/react/LexicalListPlugin';
import CheckListPlugin from '@lexical/react/LexicalCheckListPlugin';
import CodeHighlightPlugin from './plugins/code-highlight-plugin';
import AutoLinkPlugin from './plugins/autolink-plugin';
import ImagesPlugin from './plugins/images-plugin';
import TablePlugin from '@lexical/react/LexicalTablePlugin';
import ClearPlugin from '@lexical/react/LexicalClearEditorPlugin';
import MarkdownShortcutPlugin from './plugins/markdown-shotcurt-plugin';
import TableCellResizerPlugin from './plugins/table-cell-resizer-plugin';

// import TableActionMenuPlugin from './plugins/TableActionMenuPlugin';
import NodeList from './nodes';

// import CharacterStylesPopupPlugin from './plugins/CharacterStylesPopupPlugin';
import HorizontalRulePlugin from './plugins/horizontal-rule-plugin';
import ExcalidrawPlugin from './plugins/excalidraw-plugin';
import QquationsPlugin from './plugins/equations-plugin';
import { css } from '@emotion/react';
import ListMaxIndentLevelPlugin from './plugins/list-max-indent-level-plugin';
import PollPlugin from './plugins/poll-plugin';
import { ConfigProvider } from 'ultra-design';
import { ConfigProviderProps } from 'ultra-design/es/config-provider';
import zh_CN from 'ultra-design/es/locale/zh_CN';
import ActionsPlugins from './plugins/action-plugin';
import SpeechToTextPlugin from './plugins/speech-to-text-plugin';
import TableActionMenuPlugin from './plugins/table-action-menu-plugin';
import MentionsPlugin from './plugins/mentions-plugin';
import HashtagsPlugin from '@lexical/react/LexicalHashtagPlugin';
import EmojisPlugin from './plugins/emojis-plugin';
import ClickableLinkPlugin from './plugins/clickable-link-plugin';
import TabFocusPlugin from './plugins/tab-focus-plugin';
import KeywordsPlugin from './plugins/keywords-plugin';
import EquationsPlugin from './plugins/equations-plugin';
import NeteastMusicPlugin from './plugins/neteast-music-plugin';
import ContentEditable from './components/content-editable';
import Placeholder from './components/placeholder';
import { EditorPropsContext } from './context/editor-props-context';
import { FC } from 'react';
import useUltraContext from './context/ultra-context';
import { fade } from 'ultra-design/es/utils/fade';
import { UploadRef } from 'ultra-design/es/upload/upload';
import Square from './images/icons/square.svg';
import SquareCheck from './images/icons/square-check.svg';

const initialConfig = {
  theme: Theme,
  nodes: NodeList,
  onError: (error: Error) => {
    console.error(error);
  },
};

export interface EditorProps {
  theme: 'dark' | 'light';
  handleUploadImages?: (imageList: UploadRef['imageList']) => Promise<{ src: string }[]>;
}

const Editor: FC<EditorProps> = props => {
  const { theme } = props;
  const ultraContext = useUltraContext();

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorPropsContext.Provider value={props}>
        <ConfigProvider locale={zh_CN} theme={{ mode: theme }}>
          <div className="UltraEditor-root" css={rootEditorStyle(ultraContext)}>
            <ToolbarPlugin />

            <div className="UltraEditor-container">
              <RichTextPlugin contentEditable={<ContentEditable />} placeholder={<Placeholder />} />
              <HistoryPlugin />
              <AutoFocusPlugin />
              <CodeHighlightPlugin />
              <ListPlugin />
              <LinkPlugin />
              <CheckListPlugin />
              <AutoLinkPlugin />
              <MarkdownShortcutPlugin />
              <ImagesPlugin />
              <TablePlugin />
              <TableCellResizerPlugin />
              <TableActionMenuPlugin />
              {/* <CharacterStylesPopupPlugin /> */}
              <HorizontalRulePlugin />
              <ExcalidrawPlugin />
              <QquationsPlugin />
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
              <ClearPlugin />
              <TabFocusPlugin />
              <EquationsPlugin />
              <NeteastMusicPlugin />
            </div>
          </div>
        </ConfigProvider>
      </EditorPropsContext.Provider>
    </LexicalComposer>
  );
};

export default Editor;

const rootEditorStyle = (ultraContext: ConfigProviderProps) => {
  const { theme } = ultraContext;
  const { primaryColor } = theme.style;
  const { textColor, borderColor, backgroundColor } = theme[theme.mode];

  return css`
    margin: 20px auto;
    border-radius: 2px;
    max-width: 1000px;
    color: ${textColor};
    position: relative;
    line-height: 20px;
    font-weight: 400;

    .UltraEditor-container {
      background: ${backgroundColor};
      position: relative;
      cursor: text;
      display: block;
    }

    a {
      color: ${primaryColor};
    }

    .emoji {
      color: transparent;
      background-size: 16px 16px;
      background-position: center;
      background-repeat: no-repeat;
      vertical-align: middle;
      margin: 0 -1px;

      .emoji-inner {
        padding: 0 0.15em;
      }

      .emoji-inner::selection {
        color: transparent;
        background-color: rgba(150, 150, 150, 0.4);
      }

      .emoji-inner::moz-selection {
        color: transparent;
        background-color: rgba(150, 150, 150, 0.4);
      }
    }

    span.UltraEditor__image {
      cursor: default;
      display: inline-block;
      position: relative;
      img {
        max-width: 100%;
      }

      img.focused {
        outline: 2px solid ${primaryColor};
        user-select: none;
      }
    }

    .UltraEditor__ltr {
      text-align: left;
    }
    .UltraEditor__rtl {
      text-align: right;
    }
    .UltraEditor__paragraph {
      margin: 0;
      margin-bottom: 8px;
      position: relative;
    }
    .UltraEditor__paragraph:last-child {
      margin-bottom: 0;
    }
    .UltraEditor__quote {
      margin: 0;
      margin-left: 20px;
      font-size: 15px;
      color: rgb(101, 103, 107);
      border-left-color: rgb(206, 208, 212);
      border-left-width: 4px;
      border-left-style: solid;
      padding-left: 16px;
    }
    .UltraEditor__h1 {
      font-size: 24px;
      color: rgb(5, 5, 5);
      font-weight: 400;
      margin: 0;
      margin-bottom: 12px;
      padding: 0;
    }
    .UltraEditor__h2 {
      font-size: 15px;
      color: rgb(101, 103, 107);
      font-weight: 700;
      margin: 0;
      margin-top: 10px;
      padding: 0;
      text-transform: uppercase;
    }
    .UltraEditor__textBold {
      font-weight: bold;
    }
    .UltraEditor__textItalic {
      font-style: italic;
    }
    .UltraEditor__textUnderline {
      text-decoration: underline;
    }
    .UltraEditor__textStrikethrough {
      text-decoration: line-through;
    }
    .UltraEditor__textUnderlineStrikethrough {
      text-decoration: underline line-through;
    }
    .UltraEditor__textSubscript {
      font-size: 0.8em;
      vertical-align: sub !important;
    }
    .UltraEditor__textSuperscript {
      font-size: 0.8em;
      vertical-align: super;
    }
    .UltraEditor__textCode {
      background-color: rgb(240, 242, 245);
      padding: 1px 0.25rem;
      font-family: Menlo, Consolas, Monaco, monospace;
      font-size: 94%;
    }
    .UltraEditor__hashtag {
      background-color: rgba(88, 144, 255, 0.15);
      border-bottom: 1px solid rgba(88, 144, 255, 0.3);
    }
    .UltraEditor__link {
      color: rgb(33, 111, 219);
      text-decoration: none;
    }
    .UltraEditor__link:hover {
      text-decoration: underline;
    }
    .UltraEditor__code {
      /* font-family: Menlo, Consolas, Monaco, monospace; */
      display: block;
      padding: 8px 8px 8px 52px;
      line-height: 1.53;
      font-size: 13px;
      margin: 0;
      margin-top: 8px;
      margin-bottom: 8px;
      tab-size: 2;
      /* white-space: pre; */
      overflow-x: auto;
      position: relative;
    }
    .UltraEditor__code:before {
      content: attr(data-gutter);
      position: absolute;
      left: 0;
      top: 0;
      border-right: 1px solid ${borderColor};
      padding: 8px;
      color: #777;
      white-space: pre-wrap;
      text-align: right;
      min-width: 25px;
    }
    .UltraEditor__code:after {
      content: attr(data-highlight-language);
      top: 3px;
      right: 3px;
      padding: 3px;
      font-size: 10px;
      text-transform: uppercase;
      position: absolute;
      color: ${fade(textColor, 0.5)};
      background-color: #f2f3f5;
      border: 1px solid #f2f3f5;
    }
    .UltraEditor__table {
      border-collapse: collapse;
      border-spacing: 0;
      max-width: 100%;
      overflow-y: scroll;
      table-layout: fixed;
      width: 100%;
    }
    .UltraEditor__tableCell {
      border: 1px solid black;
      padding: 8px;
      height: 40px;
      min-width: 75px;
      vertical-align: top;
      text-align: start;
    }
    .UltraEditor__tableCellHeader {
      background-color: #f2f3f5;
      text-align: start;
    }
    .UltraEditor__characterLimit {
      display: inline;
      background-color: #ffbbbb !important;
    }
    .UltraEditor__ol1 {
      padding: 0;
      margin: 0;
      margin-left: 16px;
    }
    .UltraEditor__ol2 {
      padding: 0;
      margin: 0;
      margin-left: 16px;
      list-style-type: upper-alpha;
    }
    .UltraEditor__ol3 {
      padding: 0;
      margin: 0;
      margin-left: 16px;
      list-style-type: lower-alpha;
    }
    .UltraEditor__ol4 {
      padding: 0;
      margin: 0;
      margin-left: 16px;
      list-style-type: upper-roman;
    }
    .UltraEditor__ol5 {
      padding: 0;
      margin: 0;
      margin-left: 16px;
      list-style-type: lower-roman;
    }
    .UltraEditor__ul {
      padding: 0;
      margin: 0;
      margin-left: 16px;
    }
    .UltraEditor__listItem {
      margin: 8px 32px 8px 32px;
    }
    .UltraEditor__nestedListItem {
      list-style-type: none;
    }
    .UltraEditor__listItemChecked,
    .UltraEditor__listItemUnchecked {
      position: relative;
      margin-left: 8px;
      margin-right: 8px;
      padding-left: 24px;
      padding-right: 24px;
      list-style-type: none;
      outline: none;
    }
    .UltraEditor__listItemChecked {
      text-decoration: line-through;
    }
    .UltraEditor__listItemUnchecked:before,
    .UltraEditor__listItemChecked:before {
      content: '';
      width: 16px;
      height: 16px;
      top: 2px;
      left: 0;
      cursor: pointer;
      display: block;
      background-size: cover;
      position: absolute;
    }
    .UltraEditor__listItemUnchecked[dir='rtl']:before,
    .UltraEditor__listItemChecked[dir='rtl']:before {
      left: auto;
      right: 0;
    }
    .UltraEditor__listItemUnchecked:focus:before,
    .UltraEditor__listItemChecked:focus:before {
      box-shadow: 0 0 0 2px ${primaryColor};
      border-radius: 2px;
    }
    .UltraEditor__listItemUnchecked:before {
      background-image: url(${Square});
    }
    .UltraEditor__listItemChecked:before {
      background-image: url(${SquareCheck});
    }

    .excalidraw-button.selected,
    .embed-block.focused {
      outline: 2px solid ${primaryColor};
      user-select: none;
    }
  `;
};

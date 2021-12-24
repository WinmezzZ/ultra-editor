import { css } from '@emotion/react';

export const editorStyles = css`
  background: #fff;
  border: 1px solid #ddd;
  font-size: 14px;
  padding: 15px;

  .ultra-editor {
    border-top: 1px solid #ddd;
    cursor: text;
    font-size: 16px;
    margin-top: 10px;
  }

  .ultra-editor .public-DraftEditorPlaceholder-root,
  .ultra-editor .public-DraftEditor-content {
    margin: 0 -15px -15px;
    padding: 15px;
  }

  .ultra-editor .public-DraftEditor-content {
    min-height: 100px;
  }

  .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
    display: none;
  }

  .ultra-editor .RichEditor-blockquote {
    border-left: 5px solid #eee;
    color: #666;
    font-family: 'Hoefler Text', 'Georgia', serif;
    font-style: italic;
    margin: 16px 0;
    padding: 10px 20px;
  }

  .ultra-editor .public-DraftStyleDefault-pre {
    background-color: rgba(0, 0, 0, 0.05);
    font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
    font-size: 16px;
    padding: 20px;
  }

  .ultra-editor-toolbar {
    font-family: 'Helvetica', sans-serif;
    font-size: 14px;
    margin-bottom: 5px;
    user-select: none;
    > * {
      margin-right: 8px;
    }
  }

  .RichEditor-styleButton {
    color: #999;
    cursor: pointer;
    margin-right: 16px;
    padding: 2px 0;
    display: inline-block;
  }

  .RichEditor-activeButton {
    color: #5890ff;
  }
`;

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
  RangeSelection,
  ElementNode,
  OUTDENT_CONTENT_COMMAND,
  INDENT_CONTENT_COMMAND,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  $getSelectionStyleValueForProperty,
  $wrapLeafNodesInElements,
  $isAtNodeEnd,
  $patchStyleText,
} from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createCodeNode, $isCodeNode, getDefaultCodeLanguage, getCodeLanguages } from '@lexical/code';
import { Button, Divider, Dropdown, Input, Modal, Select, Toast, Tooltip } from 'ultra-design';
import {
  Add,
  AlignTextBoth,
  AlignTextCenter,
  AlignTextLeft,
  AlignTextRight,
  Checklist,
  Code,
  DividingLine,
  Formula,
  H1,
  H2,
  H3,
  ImageFiles,
  IndentLeft,
  IndentRight,
  InsertTable,
  LevelFourTitle,
  LinkOne,
  ListBottom,
  OrderedList,
  Quote,
  Redo,
  Strikethrough,
  TextBold,
  TextItalic,
  TextUnderline,
  Undo,
} from '@icon-park/react';
import { css, Global } from '@emotion/react';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_EXCALIDRAW_COMMAND } from './ExcalidrawPlugin';
import { INSERT_POLL_COMMAND } from './PollPlugin';
import InsetImageDialog from './toolbar-plugin/insert-image';
import LinkEditor from '../components/link-editor';

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol']);

const fontSizeList = ['12px', '13px', '14px', '15px', '16px', '18px', '20px', '24px', '28px', '30px', '32px', '40px'];

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();

  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();

  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({ editor, blockType, setBlockType }) {
  const formatParagraph = () => {
    if (blockType !== 'paragraph') {
      editor.update(() => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatHeading = (headingType: HeadingTagType) => {
    if (blockType !== headingType) {
      editor.update(() => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode(headingType) as unknown as ElementNode);
        }
      });
    }
  };

  const typeMap = {
    paragraph: formatParagraph,
    h1: () => formatHeading('h1'),
    h2: () => formatHeading('h2'),
    h3: () => formatHeading('h3'),
    h4: () => formatHeading('h4'),
  };

  const onChangeBlockType = type => {
    setBlockType(type);
    typeMap[type]();
  };

  return (
    <Select
      css={blockSelectStyle}
      value={Object.keys(typeMap).includes(blockType) ? blockType : 'paragraph'}
      onChange={onChangeBlockType}
    >
      <Select.Option value="paragraph">
        <AlignTextBoth theme="outline" size="18" />
        <span className="text">正文</span>
      </Select.Option>
      <Select.Option value="h1">
        <H1 theme="outline" size="18" />
        <span className="h1">标题1</span>
      </Select.Option>
      <Select.Option value="h2">
        <H2 theme="outline" size="18" />
        <span className="h2">标题2</span>
      </Select.Option>
      <Select.Option value="h3">
        <H3 theme="outline" size="18" />
        <span className="h3">标题3</span>
      </Select.Option>
      <Select.Option value="h4">
        <LevelFourTitle size="18" />
        <span className="h4">标题4</span>
      </Select.Option>
    </Select>
  );
}

const blockSelectStyle = css`
  .ultra-select-option,
  .ultra-select__selection {
    display: flex;
    align-items: center;
    .i-icon {
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
    }
  }
`;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [fontSize, setFontSize] = useState('14px');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const rowsRef = useRef<HTMLInputElement>();
  const columnsRef = useRef<HTMLInputElement>();
  const questionRef = useRef<HTMLInputElement>();
  const [insertImageModalVisible, setInsertImageModalVisible] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection() as RangeSelection;

    if ($isRangeSelection(selection)) {
      const anchorNode: any = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList: any = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();

          setBlockType(type);
        } else {
          const type = $isHeadingNode(element) ? element.getTag() : element.getType();

          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '14px'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        _payload => {
          updateToolbar();

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);

          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const onCodeLanguageSelect = useCallback(
    value => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node: any = $getNodeByKey(selectedElementKey);

          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [editor, selectedElementKey],
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const applyStyleText = useCallback(
    styles => {
      editor.update(() => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
    },
    [editor],
  );

  const onFontSizeSelect = useCallback(
    value => {
      applyStyleText({ 'font-size': value });
    },
    [applyStyleText],
  );

  const inSertCodeBlock = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createCodeNode());
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, {});
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, {});
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, {});
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, {});
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection() as RangeSelection;

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode() as unknown as ElementNode);
        }
      });
    }
  };

  return (
    <div className="toolbar" css={toolbarStyles()} ref={toolbarRef}>
      <Global
        styles={css`
          .i-icon {
            display: inline-flex;
            align-items: center;
            & + * {
              margin-left: 8px;
            }
          }
        `}
      ></Global>

      <InsetImageDialog visible={insertImageModalVisible} onVisibleChange={setInsertImageModalVisible} />

      <Dropdown
        trigger="click"
        content={
          <>
            <Dropdown.Item onClick={inSertCodeBlock}>
              <Code size="18" />
              <span>代码块</span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setInsertImageModalVisible(true)}>
              <ImageFiles size="18" />
              <span>图片</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, {});
              }}
            >
              <Formula size="18" />
              <span>画板</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                Modal.confirm({
                  title: '插入表格',
                  content: (
                    <>
                      <Input key="1" label="行数" defaultValue="4" ref={rowsRef} />
                      <br />
                      <Input key="2" label="列数" defaultValue="4" ref={columnsRef} />
                    </>
                  ),
                  onOk: () => {
                    const rows = parseInt(rowsRef.current.value);
                    const columns = parseInt(columnsRef.current.value);
                    const r = typeof rows === 'number' && rows >= 2 ? rows : 4;
                    const c = typeof columns === 'number' && columns >= 2 ? columns : 4;

                    if (r > 10) {
                      Toast.warning('最多添加 10 行');

                      return false;
                    }
                    if (c > 10) {
                      Toast.warning('最多添加 10 列');

                      return false;
                    }

                    editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: r, columns: c });
                  },
                });
              }}
            >
              <InsertTable size="18" />
              <span>表格</span>
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                Modal.confirm({
                  title: '插入投票',
                  content: <Input label="投票标题" defaultValue="" ref={questionRef} />,
                  onOk: () => {
                    if (!questionRef.current.value) {
                      questionRef.current.focus();

                      return false;
                    }

                    editor.dispatchCommand(INSERT_POLL_COMMAND, questionRef.current.value);
                  },
                });
              }}
            >
              <Checklist size="18" />
              <span>投票</span>
            </Dropdown.Item>
          </>
        }
      >
        <Button type="pure">
          <Add size="18" />
          <span>插入</span>
        </Button>
      </Dropdown>
      <Divider vertical />
      <Button
        type="pure"
        className="toolbar-item spaced"
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, {});
        }}
      >
        <Undo />
      </Button>

      <Button
        type="pure"
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, {});
        }}
        className="toolbar-item"
      >
        <Redo />
      </Button>

      {blockType === 'code' ? (
        <Select
          css={css`
            .ultra-select {
              max-height: 300px;
              overflow-y: auto;
            }
          `}
          className="code-language"
          onChange={onCodeLanguageSelect}
          value={codeLanguage}
        >
          {getCodeLanguages().map(l => (
            <Select.Option label={l} value={l} key={l} />
          ))}
        </Select>
      ) : (
        <>
          <Divider vertical />
          {supportedBlockTypes.has(blockType) && (
            <>
              <BlockOptionsDropdownList editor={editor} blockType={blockType} setBlockType={setBlockType} />
              <Divider vertical />
            </>
          )}
          <Select value={fontSize} onChange={onFontSizeSelect}>
            {fontSizeList.map(font => (
              <Select.Option value={font} key={font}>
                {font}
              </Select.Option>
            ))}
          </Select>
          <Divider vertical />
          <Tooltip title="加粗">
            <Button type="pure" className={'toolbar-item ' + (isBold ? 'ultra-button--active' : '')}>
              <TextBold
                onClick={() => {
                  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
              />
            </Button>
          </Tooltip>
          <Tooltip title="斜体">
            <Button
              type="pure"
              className={'toolbar-item ' + (isItalic ? 'ultra-button--active' : '')}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
              }}
            >
              <TextItalic />
            </Button>
          </Tooltip>
          <Tooltip title="下划线">
            <Button
              type="pure"
              className={'toolbar-item ' + (isUnderline ? 'ultra-button--active' : '')}
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
              }}
            >
              <TextUnderline />
            </Button>
          </Tooltip>
          <Tooltip title="删除线">
            <Button
              type="pure"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
              }}
              className={'toolbar-item ' + (isStrikethrough ? 'active' : '')}
            >
              <Strikethrough />
            </Button>
          </Tooltip>
          <Tooltip title="代码">
            <Button
              type="pure"
              onClick={() => {
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
              }}
              className={'toolbar-item ' + (isCode ? 'active' : '')}
            >
              <Code />
            </Button>
          </Tooltip>
          <Tooltip title="链接">
            <Button type="pure" onClick={insertLink} className={'toolbar-item spaced ' + (isLink ? 'active' : '')}>
              <LinkOne />
            </Button>
          </Tooltip>

          {isLink && <LinkEditor />}

          <Tooltip title="列表">
            <Button
              type="pure"
              className={'toolbar-item ' + (blockType === 'ul' ? 'active' : '')}
              onClick={formatBulletList}
            >
              <ListBottom theme="outline" size="18" />
            </Button>
          </Tooltip>
          <Tooltip title="有序列表">
            <Button
              type="pure"
              className={'toolbar-item ' + (blockType === 'ol' ? 'active' : '')}
              onClick={formatNumberedList}
            >
              <OrderedList theme="outline" size="18" />
            </Button>
          </Tooltip>

          <Tooltip title="引用">
            <Button
              type="pure"
              className={'toolbar-item ' + (blockType === 'quote' ? 'active' : '')}
              onClick={formatQuote}
            >
              <Quote theme="outline" size="18" />
            </Button>
          </Tooltip>

          <Tooltip title="分隔符">
            <Button
              type="pure"
              className="toolbar-item"
              onClick={() => {
                console.log(editor);
                editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, {});
              }}
            >
              <DividingLine size="18" />
            </Button>
          </Tooltip>
          <Divider vertical />
          <Dropdown
            content={
              <>
                <Dropdown.Item onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}>
                  <AlignTextLeft /> <span>左对齐</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}>
                  <AlignTextCenter /> <span>居中对齐</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}>
                  <AlignTextRight /> <span>右对齐</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}>
                  <AlignTextBoth /> <span>两边对齐</span>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, {})}>
                  <IndentLeft /> <span>左缩进</span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => editor.dispatchCommand(INDENT_CONTENT_COMMAND, {})}>
                  <IndentRight /> <span>右缩进</span>
                </Dropdown.Item>
              </>
            }
          >
            <Button className="toolbar-item">
              <AlignTextLeft />
              <span>对齐方式</span>
            </Button>
          </Dropdown>
          <Divider vertical />
        </>
      )}
    </div>
  );
}

const toolbarStyles = () => {
  return css`
    display: flex;
    align-items: center;
    margin-bottom: 1px;
    background: #fff;
    padding: 8px 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    vertical-align: middle;
    overflow: auto;

    .ultra-divider--vertical {
      height: 20px;
      margin: 0 10px;
    }

    .toolbar-item {
      padding: 8px;
      margin: 0 4px;
    }

    .toolbar-item:hover:not([disabled]) {
      background-color: rgba(204, 204, 204, 0.3);
    }
  `;
};

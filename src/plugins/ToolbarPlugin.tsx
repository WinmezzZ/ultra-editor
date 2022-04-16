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
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isParentElementRTL, $wrapLeafNodesInElements, $isAtNodeEnd, $patchStyleText } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { createPortal } from 'react-dom';
import { $createHeadingNode, $createQuoteNode, $isHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $createCodeNode, $isCodeNode, getDefaultCodeLanguage, getCodeLanguages } from '@lexical/code';
import { Button, Divider, Dropdown, Menu, Select, Tooltip } from 'ultra-design';
import {
  Add,
  AlignTextBoth,
  AlignTextCenter,
  AlignTextLeft,
  AlignTextRight,
  Code,
  DividingLine,
  H1,
  H2,
  H3,
  ImageFiles,
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
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagesPlugin';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'ul', 'ol']);

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = '0';
    editor.style.top = '-1000px';
    editor.style.left = '-1000px';
  } else {
    editor.style.opacity = '1';
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2}px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();

      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl('');
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;

      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;

        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }

        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl('');
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();

          return true;
        },
        LowPriority,
      ),
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={event => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== '') {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === 'Escape') {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

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
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);

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
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

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

  const onChangeAlign = type => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, type);
  };

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

      <Divider vertical />
      {supportedBlockTypes.has(blockType) && (
        <>
          <BlockOptionsDropdownList editor={editor} blockType={blockType} setBlockType={setBlockType} />
          <Divider vertical />
        </>
      )}
      <Select value="14px" onChange={onFontSizeSelect}>
        {new Array(10).fill(undefined).map((_, index) => (
          <Select.Option key={index} value={`${index + 10}px`}>
            {`${index + 10}px`}
          </Select.Option>
        ))}
      </Select>
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

          {isLink && createPortal(<FloatingLinkEditor editor={editor} />, document.body)}

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
              <Menu style={{ padding: 0 }} onClick={onChangeAlign}>
                <Dropdown.Item key="left">
                  <AlignTextLeft /> <span>左对齐</span>
                </Dropdown.Item>
                <Dropdown.Item key="center">
                  <AlignTextCenter /> <span>居中对齐</span>
                </Dropdown.Item>
                <Dropdown.Item key="right">
                  <AlignTextRight /> <span>居中对齐</span>
                </Dropdown.Item>
                <Dropdown.Item key="justify">
                  <AlignTextBoth /> <span>两边对齐</span>
                </Dropdown.Item>
              </Menu>
            }
          >
            <Button className="toolbar-item">
              <AlignTextLeft />
              <span>对齐方式</span>
            </Button>
          </Dropdown>
          <Divider vertical />
          <Dropdown
            trigger="click"
            content={
              <>
                <Dropdown.Item onClick={inSertCodeBlock}>
                  <Code size="18" />
                  <span>代码块</span>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {});
                  }}
                >
                  <ImageFiles size="18" />
                  <span>图片</span>
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
    padding: 4px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    vertical-align: middle;

    .ultra-divider--vertical {
      height: 20px;
      margin: 0 10px;
    }

    .toolbar-item {
      padding: 8px;
    }

    .toolbar-item:hover:not([disabled]) {
      background-color: rgba(204, 204, 204, 0.3);
    }
  `;
};

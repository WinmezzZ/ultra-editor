import React from 'react';
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
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from '@lexical/rich-text';
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
  HorizontalSpacingBetweenItems,
  ImageFiles,
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

const LowPriority = 1;

const supportedBlockTypes = new Set(['paragraph', 'quote', 'code', 'h1', 'h2', 'ul', 'ol']);

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
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
  };

  const formatLargeHeading = () => {
    if (blockType !== 'h1') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode('h1'));
        }
      });
    }
  };

  const formatSmallHeading = () => {
    if (blockType !== 'h2') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode('h2'));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'ul') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'ol') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const onChangeBlockType = type => {
    const typeMap = {
      paragraph: formatParagraph,
      h1: formatLargeHeading,
      h2: formatSmallHeading,
      ul: formatBulletList,
      ol: formatNumberedList,
      quete: formatQuote,
    };

    setBlockType(type);
    typeMap[type]();
  };

  useEffect(() => {
    console.log(blockType);
  }, [blockType]);

  return (
    <Select css={blockSelectStyle} value={blockType} onChange={onChangeBlockType}>
      <Select.Option value="paragraph">
        <AlignTextBoth theme="outline" size="18" />
        <span className="text">正文</span>
      </Select.Option>
      <Select.Option value="h1">
        <H1 theme="outline" size="18" />
        <span className="h1">大标题</span>
      </Select.Option>
      <Select.Option value="h2">
        <H2 theme="outline" size="18" />
        <span className="h2">次标题</span>
      </Select.Option>
      <Select.Option value="h3">
        <H3 theme="outline" size="18" />
        <span className="h3">小标题</span>
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
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
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
        (_payload, newEditor) => {
          updateToolbar();

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);

          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
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
          const node = $getNodeByKey(selectedElementKey);

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
        const selection = $getSelection();

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
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createCodeNode());
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
          editor.dispatchCommand(UNDO_COMMAND);
        }}
      >
        <Undo />
      </Button>

      <Button type="pure">
        <Redo
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND);
          }}
          className="toolbar-item"
        />
      </Button>

      <Divider vertical />
      {supportedBlockTypes.has(blockType) && (
        <>
          <BlockOptionsDropdownList
            editor={editor}
            blockType={blockType}
            setBlockType={setBlockType}
            toolbarRef={toolbarRef}
          />
          <Divider vertical />
        </>
      )}
      <Select value="14px" onChange={onFontSizeSelect}>
        {new Array(10).fill().map((_, index) => (
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
            <Button type="pure" className={'toolbar-item ' + (blockType === 'ul' ? 'active' : '')}>
              <ListBottom theme="outline" size="18" />
            </Button>
          </Tooltip>
          <Tooltip title="有序列表">
            <Button type="pure" className={'toolbar-item ' + (blockType === 'ol' ? 'active' : '')}>
              <OrderedList theme="outline" size="18" />
            </Button>
          </Tooltip>

          <Tooltip title="引用">
            <Button type="pure" className={'toolbar-item ' + (blockType === 'quote' ? 'active' : '')}>
              <Quote theme="outline" size="18" />
            </Button>
          </Tooltip>

          <Tooltip title="分隔符">
            <Button
              type="pure"
              className="toolbar-item"
              onClick={() => {
                activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND);
              }}
            >
              <DividingLine size="18" />
            </Button>
          </Tooltip>
          <Divider vertical />
          <Dropdown
            content={
              <Menu style={{ padding: 0 }} onClick={onChangeAlign}>
                <Dropdown.DropdownItem key="left">
                  <AlignTextLeft /> <span>左对齐</span>
                </Dropdown.DropdownItem>
                <Dropdown.DropdownItem key="center">
                  <AlignTextCenter /> <span>居中对齐</span>
                </Dropdown.DropdownItem>
                <Dropdown.DropdownItem key="right">
                  <AlignTextRight /> <span>居中对齐</span>
                </Dropdown.DropdownItem>
                <Dropdown.DropdownItem key="justify">
                  <AlignTextBoth /> <span>两边对齐</span>
                </Dropdown.DropdownItem>
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
                <Dropdown.DropdownItem onClick={inSertCodeBlock}>
                  <Code size="18" />
                  <span>代码块</span>
                </Dropdown.DropdownItem>
                <Dropdown.DropdownItem
                  onClick={() => {
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND);
                  }}
                >
                  <ImageFiles size="18" />
                  <span>图片</span>
                </Dropdown.DropdownItem>
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

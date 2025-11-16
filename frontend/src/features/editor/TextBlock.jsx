import React, { useState, useEffect, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import FloatingToolbar from './FloatingToolbar';

// (Style Map này cũng được export để FloatingToolbar sử dụng nếu cần)
export const colorStyleMap = {
  // Màu chữ
  TEXT_COLOR_DEFAULT: { color: 'inherit' },
  TEXT_COLOR_GRAY: { color: 'rgb(156 163 175)' },
  TEXT_COLOR_RED: { color: 'rgb(248 113 113)' },
  TEXT_COLOR_BLUE: { color: 'rgb(96 165 250)' },
  // Màu nền
  BG_COLOR_DEFAULT: { backgroundColor: 'inherit' },
  BG_COLOR_YELLOW: { backgroundColor: 'rgba(253, 224, 71, 0.5)' },
  BG_COLOR_GREEN: { backgroundColor: 'rgba(74, 222, 128, 0.5)' },
};

const ALL_TEXT_COLORS = Object.keys(colorStyleMap).filter(s => s.startsWith('TEXT_'));
const ALL_BG_COLORS = Object.keys(colorStyleMap).filter(s => s.startsWith('BG_'));

// Hàm gán Class CSS cho Block
const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'header-one':
      return 'editor-h1';
    case 'blockquote':
      return 'editor-blockquote';
    default:
      return 'editor-paragraph';
  }
};

const TextBlock = ({ blockId, initialData, onChange }) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialData && initialData.contentState) {
      try {
        const rawContent = JSON.parse(initialData.contentState);
        const contentState = convertFromRaw(rawContent);
        return EditorState.createWithContent(contentState);
      } catch (e) {
        console.error("Failed to parse contentState", e);
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });

  const [toolbarPosition, setToolbarPosition] = useState(null);
  const editorContainerRef = useRef(null);
  const toolbarRef = useRef(null);

  const calculateToolbarPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorContainerRef.current) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const containerRect = editorContainerRef.current.getBoundingClientRect();
    
    if (rangeRect.width === 0 && rangeRect.height === 0) {
      return null;
    }
    
    const toolbarWidth = toolbarRef.current ? toolbarRef.current.offsetWidth : 240; // Ước tính chiều rộng
    let left = rangeRect.left - containerRect.left + (rangeRect.width / 2) - (toolbarWidth / 2);
    let top = rangeRect.top - containerRect.top - 50;
    if (left < 0) left = 0;

    return { top, left, opacity: 1 };
  };

  const handleEditorChange = (newState) => {
    setEditorState(newState);

    const selectionState = newState.getSelection();
    if (!selectionState.isCollapsed()) {
      setTimeout(() => {
        const position = calculateToolbarPosition();
        if (position) {
          setToolbarPosition(position);
        }
      }, 0);
    } else {
      if (toolbarPosition) {
        setToolbarPosition(null);
      }
    }

    const contentState = newState.getCurrentContent();
    const oldContentState = editorState.getCurrentContent();
    if (contentState !== oldContentState) {
      const rawContent = convertToRaw(contentState);
      const dataToSave = { contentState: JSON.stringify(rawContent) };
      onChange(blockId, dataToSave);
    }
  };

  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    handleEditorChange(newState);
  };
  
  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    handleEditorChange(newState);
  };

  const toggleColorStyle = (styleToApply) => {
    const selection = editorState.getSelection();
    const currentStyle = editorState.getCurrentInlineStyle();

    const stylesToRemove = styleToApply.startsWith('TEXT_')
      ? ALL_TEXT_COLORS
      : ALL_BG_COLORS;

    let contentState = editorState.getCurrentContent();
    const newContentState = stylesToRemove.reduce((content, style) => {
      if (currentStyle.has(style)) {
        return Modifier.removeInlineStyle(content, selection, style);
      }
      return content;
    }, contentState);

    let finalContentState = newContentState;
    if (!styleToApply.endsWith('_DEFAULT')) {
      finalContentState = Modifier.applyInlineStyle(
        newContentState,
        selection,
        styleToApply
      );
    }

    handleEditorChange(
      EditorState.push(editorState, finalContentState, 'change-inline-style')
    );
  };

  const selection = editorState.getSelection();
  const currentBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="relative w-full group" ref={editorContainerRef}>
      <FloatingToolbar
        ref={toolbarRef}
        position={toolbarPosition}
        editorState={editorState}
        onToggleInlineStyle={toggleInlineStyle}
        onToggleBlockType={toggleBlockType}
        onToggleColor={toggleColorStyle}
        currentBlockType={currentBlockType}
      />

      <div
        className="mt-2 prose prose-invert max-w-none 
                   prose-strong:text-gray-100 prose-em:text-gray-100
                   prose-code:bg-neutral-700 prose-code:text-red-300
                   prose-u:decoration-gray-400"
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Start typing..."
          blockStyleFn={getBlockStyle}
          customStyleMap={colorStyleMap}
        />
      </div>
    </div>
  );
};

export default TextBlock;
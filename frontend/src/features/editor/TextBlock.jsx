import React, { useState, useEffect, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import FloatingToolbar from './FloatingToolbar';

// 1. Hàm gán Class CSS cho Block
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
      const rawContent = JSON.parse(initialData.contentState);
      const contentState = convertFromRaw(rawContent);
      return EditorState.createWithContent(contentState);
    }
    return EditorState.createEmpty();
  });

  const [toolbarPosition, setToolbarPosition] = useState(null);
  const editorContainerRef = useRef(null);
  const toolbarRef = useRef(null); // (Ref này sẽ dùng để tính toán vị trí)

  // (calculateToolbarPosition giữ nguyên)
  const calculateToolbarPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorContainerRef.current) {
      return null;
    }

    const range = selection.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const containerRect = editorContainerRef.current.getBoundingClientRect();
    
    // Sửa lỗi: Căn chỉnh 'left' dựa trên chiều rộng toolbar
    // (Giả sử toolbar rộng khoảng 160px)
    const toolbarWidth = 160; 
    let left = rangeRect.left - containerRect.left + (rangeRect.width / 2) - (toolbarWidth / 2);

    let top = rangeRect.top - containerRect.top - 50; // 50px = 40px cao + 10px lề
    if (left < 0) left = 0;
    
    return { top, left, opacity: 1 };
  };

  // (handleEditorChange giữ nguyên)
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

    // (Logic auto-save)
    const contentState = newState.getCurrentContent();
    const oldContentState = editorState.getCurrentContent();
    if (contentState !== oldContentState) {
      const rawContent = convertToRaw(contentState);
      const dataToSave = { contentState: JSON.stringify(rawContent) };
      onChange(blockId, dataToSave);
    }
  };

  // (handleKeyCommand giữ nguyên)
  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // 1. toggleInlineStyle (Đã có, không cần thay đổi)
  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    handleEditorChange(newState);
  };

  // 2. Hàm mới: Thay đổi kiểu Block
  const toggleBlockType = (blockType) => {
    const newState = RichUtils.toggleBlockType(editorState, blockType);
    handleEditorChange(newState);
  };

  // 3. Lấy kiểu Block hiện tại
  const selection = editorState.getSelection();
  const currentBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  
  return (
    <div className="relative w-full group" ref={editorContainerRef}>
      
      {/* 2. Truyền props vào FloatingToolbar */}
      <FloatingToolbar
        ref={toolbarRef}
        position={toolbarPosition}
        editorState={editorState}
        onToggleInlineStyle={toggleInlineStyle}
        onToggleBlockType={toggleBlockType} // <-- 4. Truyền prop mới
        currentBlockType={currentBlockType} // <-- 4. Truyền prop mới
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
          blockStyleFn={getBlockStyle} // <-- 5. Áp dụng hàm gán Class
        />
      </div>
    </div>
  );
};

export default TextBlock;
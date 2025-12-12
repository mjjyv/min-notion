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
import SlashMenu from './SlashMenu'; // Thêm import SlashMenu

// Style Map (giữ nguyên)
export const colorStyleMap = {
  TEXT_COLOR_DEFAULT: { color: 'inherit' },
  TEXT_COLOR_GRAY: { color: 'rgb(156 163 175)' },
  TEXT_COLOR_RED: { color: 'rgb(248 113 113)' },
  TEXT_COLOR_BLUE: { color: 'rgb(96 165 250)' },
  BG_COLOR_DEFAULT: { backgroundColor: 'inherit' },
  BG_COLOR_YELLOW: { backgroundColor: 'rgba(253, 224, 71, 0.5)' },
  BG_COLOR_GREEN: { backgroundColor: 'rgba(74, 222, 128, 0.5)' },
};

const ALL_TEXT_COLORS = Object.keys(colorStyleMap).filter(s => s.startsWith('TEXT_'));
const ALL_BG_COLORS = Object.keys(colorStyleMap).filter(s => s.startsWith('BG_'));

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

const TextBlock = ({ blockId, initialData, onChange, onReplace }) => { // Thêm onReplace
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
  const [slashMenuPosition, setSlashMenuPosition] = useState(null); // Thêm state cho Slash Menu

  const editorContainerRef = useRef(null);
  const toolbarRef = useRef(null);

  // Tính vị trí FloatingToolbar (giữ nguyên)
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

    const toolbarWidth = toolbarRef.current ? toolbarRef.current.offsetWidth : 240;
    let left = rangeRect.left - containerRect.left + (rangeRect.width / 2) - (toolbarWidth / 2);
    let top = rangeRect.top - containerRect.top - 50;
    if (left < 0) left = 0;
    return { top, left, opacity: 1 };
  };

  const handleEditorChange = (newState) => {
    setEditorState(newState);

    const selection = newState.getSelection();
    const content = newState.getCurrentContent();
    const currentBlock = content.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();
    const startOffset = selection.getStartOffset();

    // Phát hiện gõ '/' ở đầu dòng + đang collapsed (chưa chọn vùng)
    if (blockText.startsWith('/') && startOffset === 1 && selection.isCollapsed() && blockText.length <= 20) {
      // Hiển thị Slash Menu ngay dưới vị trí con trỏ
      const domSelection = window.getSelection();
      if (domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSlashMenuPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
        });
      }
    } else {
      setSlashMenuPosition(null);
    }

    // Cập nhật FloatingToolbar khi có selection
    if (!selection.isCollapsed()) {
      setTimeout(() => {
        const position = calculateToolbarPosition();
        if (position) setToolbarPosition(position);
      }, 0);
    } else {
      setToolbarPosition(null);
    }

    // Lưu nội dung khi thay đổi
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
    const stylesToRemove = styleToApply.startsWith('TEXT_') ? ALL_TEXT_COLORS : ALL_BG_COLORS;

    let contentState = editorState.getCurrentContent();
    const newContentState = stylesToRemove.reduce((content, style) => {
      if (currentStyle.has(style)) {
        return Modifier.removeInlineStyle(content, selection, style);
      }
      return content;
    }, contentState);

    let finalContentState = newContentState;
    if (!styleToApply.endsWith('_DEFAULT')) {
      finalContentState = Modifier.applyInlineStyle(newContentState, selection, styleToApply);
    }

    handleEditorChange(EditorState.push(editorState, finalContentState, 'change-inline-style'));
  };

  // Xử lý khi chọn lệnh từ SlashMenu
  const onSlashCommand = (command) => {
    setSlashMenuPosition(null);

    // Xóa dấu '/' và khoảng trắng (nếu có)
    const selection = editorState.getSelection();
    const currentBlock = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
    const blockKey = currentBlock.getKey();
    let contentState = editorState.getCurrentContent();

    // Xóa từ đầu dòng đến vị trí hiện tại (xóa '/...')
    const newSelection = selection.merge({
      anchorOffset: 0,
      focusOffset: selection.getFocusOffset(),
    });
    contentState = Modifier.removeRange(contentState, newSelection, 'backward');
    let newEditorState = EditorState.push(editorState, contentState, 'remove-range');

    if (command.type === 'block') {
      // Ví dụ: /h1 → chuyển thành heading-one
      newEditorState = RichUtils.toggleBlockType(newEditorState, command.id);
    } else if (command.type === 'convert' || command.type === 'insert') {
      // Chuyển sang block khác (Todo, Image, Code, v.v.)
      const textToPass = command.type === 'convert' ? currentBlock.getText().slice(selection.getFocusOffset()) : '';
      onReplace(blockId, command.target, { text: textToPass });
      return; // Không cần update editorState nữa vì block sẽ bị thay thế
    }

    // Cập nhật lại editor (chỉ khi không replace)
    handleEditorChange(newEditorState);
    // Focus lại editor
    setTimeout(() => editorState.getEditorRef()?.focus(), 0);
  };

  const selection = editorState.getSelection();
  const currentBlockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="relative w-full group" ref={editorContainerRef}>
      {/* Floating Toolbar */}
      <FloatingToolbar
        ref={toolbarRef}
        position={toolbarPosition}
        editorState={editorState}
        onToggleInlineStyle={toggleInlineStyle}
        onToggleBlockType={toggleBlockType}
        onToggleColor={toggleColorStyle}
        currentBlockType={currentBlockType}
      />

      {/* Slash Menu */}
      {slashMenuPosition && (
        <SlashMenu
          position={slashMenuPosition}
          onSelect={onSlashCommand}
          onClose={() => setSlashMenuPosition(null)}
        />
      )}

      {/* Editor */}
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
          placeholder="Start typing... (gõ / để thêm khối)"
          blockStyleFn={getBlockStyle}
          customStyleMap={colorStyleMap}
        />
      </div>
    </div>
  );
};

export default TextBlock;
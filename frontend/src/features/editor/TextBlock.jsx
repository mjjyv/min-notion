import React, { useState, useEffect } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import 'draft-js/dist/Draft.css'; // Import CSS cơ bản của Draft.js
import BlockToolbar from './BlockToolbar';

/**
 * @param {object} initialData - { contentState: ... } (JSON từ DB)
 * @param {function} onChange - Hàm callback khi nội dung thay đổi
 * @param {string} blockId - ID của block này
 */
const TextBlock = ({ blockId, initialData, onChange }) => {
  // 1. Khởi tạo EditorState
  const [editorState, setEditorState] = useState(() => {
    if (initialData && initialData.contentState) {
      // Tải nội dung (JSON) từ DB
      const rawContent = JSON.parse(initialData.contentState);
      const contentState = convertFromRaw(rawContent);
      return EditorState.createWithContent(contentState);
    }
    // Hoặc tạo mới
    return EditorState.createEmpty();
  });

  const [showToolbar, setShowToolbar] = useState(false);

  // 2. Xử lý thay đổi (gõ phím)
  const handleEditorChange = (newState) => {
    setEditorState(newState);

    // Kiểm tra xem nội dung có thay đổi không
    const contentState = newState.getCurrentContent();
    const oldContentState = editorState.getCurrentContent();

    if (contentState !== oldContentState) {
      // Chuyển nội dung sang JSON thô để chuẩn bị lưu
      const rawContent = convertToRaw(contentState);
      const dataToSave = { contentState: JSON.stringify(rawContent) };
      
      // Báo cho parent (CoreEditor) biết có thay đổi
      onChange(blockId, dataToSave);
    }
  };

  // 3. Xử lý phím nóng (Hotkeys: Ctrl+B, Ctrl+I)
  const handleKeyCommand = (command, state) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  // 4. Xử lý nút bấm trên Toolbar
  const toggleInlineStyle = (inlineStyle) => {
    const newState = RichUtils.toggleInlineStyle(editorState, inlineStyle);
    handleEditorChange(newState);
  };
  
  // 5. Hiển thị toolbar khi editor được focus
  const onFocus = () => setShowToolbar(true);
  // (Tùy chọn: onBlur = () => setShowToolbar(false))

  return (
    <div className="relative w-full group">
      {/* Toolbar (Tạm thời luôn hiển thị khi focus)
        (Tương lai: Có thể làm Pop-up khi bôi đen text)
      */}
      {showToolbar && (
        <BlockToolbar
          editorState={editorState}
          onToggle={toggleInlineStyle}
        />
      )}

      {/* Container của Draft.js
        Sử dụng lớp 'prose' của Tailwind Typography (từ GĐ 4.1)
        và các style custom (từ index.css)
      */}
      <div 
        className="mt-2 prose prose-invert max-w-none 
                   prose-strong:text-gray-100 prose-em:text-gray-100"
        onClick={onFocus}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          handleKeyCommand={handleKeyCommand}
          placeholder="Start typing..."
        />
      </div>
    </div>
  );
};

export default TextBlock;
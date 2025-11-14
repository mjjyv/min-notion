import React from 'react';
import { Bold, Italic } from 'lucide-react'; // Icons

// Component Button nhỏ cho Toolbar
const StyleButton = ({ onToggle, style, isActive, children }) => {
  const onMouseDown = (e) => {
    e.preventDefault(); // Ngăn editor mất focus
    onToggle(style);
  };

  return (
    <button
      onMouseDown={onMouseDown}
      className={`
        px-2 py-1 rounded
        ${isActive ? 'bg-brand text-white' : 'text-gray-400 hover:bg-neutral-700'}
      `}
    >
      {children}
    </button>
  );
};

// Toolbar chính
const BlockToolbar = ({ editorState, onToggle }) => {
  // Lấy style hiện tại (ví dụ: 'BOLD')
  const currentStyle = editorState.getCurrentInlineStyle();

  return (
    <div className="flex items-center space-x-1 p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg">
      <StyleButton
        onToggle={onToggle}
        style="BOLD"
        isActive={currentStyle.has('BOLD')}
      >
        <Bold className="h-4 w-4" />
      </StyleButton>
      <StyleButton
        onToggle={onToggle}
        style="ITALIC"
        isActive={currentStyle.has('ITALIC')}
      >
        <Italic className="h-4 w-4" />
      </StyleButton>
      {/* (Tương lai: Thêm nút 'LINK' ở đây) */}
    </div>
  );
};

export default BlockToolbar;
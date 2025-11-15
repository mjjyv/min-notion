import React, { forwardRef } from 'react';
import { Bold, Italic, Underline, Code } from 'lucide-react';

const StyleButton = ({ onToggle, style, isActive, children }) => {
  const onMouseDown = (e) => {
    e.preventDefault();
    onToggle(style);
  };
  return (
    <button
      onMouseDown={onMouseDown}
      className={`p-2 rounded ${
        isActive
          ? 'bg-brand text-white'
          : 'text-gray-400 hover:bg-neutral-700 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
};

// 1. Danh sách các kiểu Block
const BLOCK_TYPES = [
  { label: 'Paragraph', style: 'unstyled' },
  { label: 'Heading 1', style: 'header-one' },
  { label: 'Blockquote', style: 'blockquote' },
];

const FloatingToolbar = forwardRef(
  (
    {
      position,
      editorState,
      onToggleInlineStyle,
      onToggleBlockType, // <-- 2. Thêm prop mới
      currentBlockType, // <-- 2. Thêm prop mới
    },
    ref,
  ) => {
    if (!position) return null;
    const { top, left, opacity } = position;
    const currentStyle = editorState.getCurrentInlineStyle();

    // 3. Hàm xử lý khi thay đổi Dropdown
    const onBlockTypeChange = (e) => {
      e.preventDefault();
      onToggleBlockType(e.target.value);
    };

    return (
      <div
        ref={ref}
        className="absolute z-10"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          opacity: opacity,
          transition: 'opacity 0.1s, top 0.1s, left 0.1s',
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center space-x-1 p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg">
          
          {/* 4. Thêm Dropdown (Select) */}
          <select
            className="text-sm bg-neutral-800 text-gray-100 border-none rounded px-2 py-1 focus:ring-brand"
            value={currentBlockType}
            onChange={onBlockTypeChange}
          >
            {BLOCK_TYPES.map((type) => (
              <option key={type.style} value={type.style}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Dải phân cách */}
          <div className="w-px h-5 bg-neutral-700 mx-1"></div>

          {/* (Các nút Inline Style giữ nguyên) */}
          <StyleButton
            onToggle={onToggleInlineStyle}
            style="BOLD"
            isActive={currentStyle.has('BOLD')}
          >
            <Bold className="h-4 w-4" />
          </StyleButton>
          <StyleButton
            onToggle={onToggleInlineStyle}
            style="ITALIC"
            isActive={currentStyle.has('ITALIC')}
          >
            <Italic className="h-4 w-4" />
          </StyleButton>
          <StyleButton
            onToggle={onToggleInlineStyle}
            style="UNDERLINE"
            isActive={currentStyle.has('UNDERLINE')}
          >
            <Underline className="h-4 w-4" />
          </StyleButton>
          <StyleButton
            onToggle={onToggleInlineStyle}
            style="CODE"
            isActive={currentStyle.has('CODE')}
          >
            <Code className="h-4 w-4" />
          </StyleButton>
        </div>
      </div>
    );
  },
);

FloatingToolbar.displayName = 'FloatingToolbar';
export default FloatingToolbar;
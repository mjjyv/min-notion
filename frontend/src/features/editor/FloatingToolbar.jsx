import React, { forwardRef } from 'react';
import * as Popover from '@radix-ui/react-popover'; // 1. Import Popover
import { Bold, Italic, Underline, Code, CaseSensitive } from 'lucide-react';

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

// 3. Component Popover Chọn màu
const ColorPickerPopover = ({ onToggle, currentStyle }) => {
  // const textColors = [
  //   { label: 'Default', style: 'TEXT_COLOR_DEFAULT' },
  //   { label: 'Gray', style: 'TEXT_COLOR_GRAY', colorClass: 'text-gray-400' },
  //   { label: 'Red', style: 'TEXT_COLOR_RED', colorClass: 'text-red-400' },
  //   { label: 'Blue', style: 'TEXT_COLOR_BLUE', colorClass: 'text-blue-400' },
  // ];
  // const bgColors = [
  //   { label: 'Default', style: 'BG_COLOR_DEFAULT' },
  //   { label: 'Yellow', style: 'BG_COLOR_YELLOW', colorClass: 'bg-yellow-500/50' },
  //   { label: 'Green', style: 'BG_COLOR_GREEN', colorClass: 'bg-green-500/50' },
  // ];

  const textColors = [
    // Sửa: Thêm colorClass cho Default và đổi text- thành bg- cho các màu khác
    { label: 'Default', style: 'TEXT_COLOR_DEFAULT', colorClass: 'bg-white' }, 
    { label: 'Gray', style: 'TEXT_COLOR_GRAY', colorClass: 'bg-gray-400' },
    { label: 'Red', style: 'TEXT_COLOR_RED', colorClass: 'bg-red-400' },
    { label: 'Blue', style: 'TEXT_COLOR_BLUE', colorClass: 'bg-blue-400' },
  ];
  const bgColors = [
    // Sửa: Thêm colorClass cho Default (ví dụ: một swatch có viền)
    { label: 'Default', style: 'BG_COLOR_DEFAULT', colorClass: 'border border-gray-400' }, 
    { label: 'Yellow', style: 'BG_COLOR_YELLOW', colorClass: 'bg-yellow-500/50' },
    { label: 'Green', style: 'BG_COLOR_GREEN', colorClass: 'bg-green-500/50' },
  ];

  

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 text-gray-400 hover:bg-neutral-700 hover:text-white rounded">
          <CaseSensitive className="h-4 w-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={5}
          onMouseDown={(e) => e.preventDefault()} // Ngăn editor mất focus
          className="bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-20 p-2"
        >
          <div className="text-xs text-gray-400 mb-1 px-1">Text Color</div>
          <div className="flex space-x-1 mb-2">
            {textColors.map(({ style, colorClass }) => (
              <button
                key={style}
                onClick={() => onToggle(style)}
                className={`h-5 w-5 rounded ${colorClass} ${
                  currentStyle.has(style) ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-gray-400 mb-1 px-1">Background Color</div>
          <div className="flex space-x-1">
            {bgColors.map(({ style, colorClass }) => (
              <button
                key={style}
                onClick={() => onToggle(style)}
                className={`h-5 w-5 rounded ${colorClass} ${
                  currentStyle.has(style) ? 'ring-2 ring-white' : ''
                }`}
              />
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};


const FloatingToolbar = forwardRef(
  (
    {
      position,
      editorState,
      onToggleInlineStyle,
      onToggleBlockType, // <-- 2. Thêm prop mới
      onToggleColor, // <-- 4. Thêm prop mới
      currentBlockType, // <-- 2. Thêm prop mới
    },
    ref,
  ) => {
    if (!position) return null;
    const { top, left, opacity } = position;
    const currentStyle = editorState.getCurrentInlineStyle();

    // 3. Hàm xử lý khi thay đổi Dropdown
    const onBlockTypeChange = (e) => {
      // e.preventDefault();
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
        // onMouseDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center space-x-1 p-1 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg">
          
          {/* 4. Thêm Dropdown (Select) */}
          <select
            className="text-sm bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-white border-none rounded px-2 py-1 focus:ring-brand" // <-- CẬP NHẬT DÒNG NÀY
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

          {/* 5. Thêm component Popover Chọn màu */}
          <ColorPickerPopover
            onToggle={onToggleColor}
            currentStyle={currentStyle}
          />

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
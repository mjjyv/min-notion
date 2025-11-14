import React, { useState } from 'react';

/**
 * @param {object} initialData - { text: "...", checked: false }
 * @param {function} onChange - Hàm callback khi nội dung thay đổi
 * @param {string} blockId - ID của block này
 */
const TodoBlock = ({ blockId, initialData, onChange }) => {
  // 1. Quản lý trạng thái nội bộ
  const [text, setText] = useState(initialData.text || '');
  const [checked, setChecked] = useState(initialData.checked || false);

  // 2. Xử lý thay đổi Checkbox
  const handleCheckChange = (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    // Báo cho parent (CoreEditor)
    onChange(blockId, { text, checked: newChecked });
  };

  // 3. Xử lý gõ text
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // 4. Xử lý khi ngừng gõ (onBlur) để lưu
  const handleBlur = () => {
    // Chỉ báo thay đổi khi blur (tiết kiệm)
    onChange(blockId, { text, checked });
  };

  return (
    <div className="flex items-center space-x-3 group">
      {/* 1. Checkbox (Tailwind Forms) */}
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckChange}
        className="
          h-4 w-4 bg-neutral-800 border-neutral-600 rounded 
          text-brand focus:ring-brand
        "
      />
      
      {/* 2. Text Input */}
      <input
        type="text"
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        placeholder="To-do"
        className={`
          w-full text-base bg-transparent border-none p-0
          focus:ring-0
          ${checked ? 'text-gray-500 line-through' : 'text-gray-100'}
        `}
      />
    </div>
  );
};

export default TodoBlock;
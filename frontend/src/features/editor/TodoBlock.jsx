import React, { useState } from 'react';

/**
 * @param {string} blockId - ID tạm thời (tempClientId) của block này
 * @param {object} initialData - { text: "...", checked: false }
 * @param {function} onChange - Hàm callback (blockId, newData) khi thay đổi
 */
const TodoBlock = ({ blockId, initialData, onChange }) => {
  const [text, setText] = useState(initialData?.text || '');
  const [checked, setChecked] = useState(initialData?.checked || false);

  const handleCheckChange = (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onChange(blockId, { text, checked: newChecked });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Gửi thay đổi text khi người dùng rời khỏi (blur) input
  const handleBlur = () => {
    onChange(blockId, { text, checked });
  };

  return (
    <div className="flex items-center space-x-3 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckChange}
        className="
          h-4 w-4 bg-neutral-800 border-neutral-600 rounded 
          text-brand focus:ring-brand
        "
      />
      
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
import React, { useState, useEffect, useRef } from 'react';
import { GripVertical } from 'lucide-react'; // Import icon kéo thả

const TodoBlock = ({
  blockId,
  initialData,
  onChange,
  onAddBlock,
  onRemoveBlock,
  shouldFocus, // Nhận prop
}) => {
  const [text, setText] = useState(initialData?.text || '');
  const [checked, setChecked] = useState(initialData?.checked || false);
  const inputRef = useRef(null);

  // --- FIX LỖI 2: AUTO FOCUS ---
  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  const handleCheckChange = (e) => {
    const newChecked = e.target.checked;
    setChecked(newChecked);
    onChange(blockId, { text, checked: newChecked });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onChange(blockId, { text: e.target.value, checked });
  };

  // --- FIX LỖI 2: ENTER & BACKSPACE ---
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddBlock(blockId);
    }
    if (e.key === 'Backspace' && text === '') {
      e.preventDefault();
      onRemoveBlock(blockId);
    }
  };

  return (
    // Thêm padding-left và margin-left âm để icon drag nằm bên trái
    <div className="flex items-start group py-1 -ml-6 pl-6 relative">
      {/* Drag Handle */}
      <div className="drag-handle absolute left-0 mt-0.5 p-0.5 rounded hover:bg-neutral-800 cursor-grab opacity-0 group-hover:opacity-100 text-gray-500 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex items-center flex-1 space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckChange}
          className="
            mt-1 h-4 w-4 bg-neutral-800 border-neutral-600 rounded 
            text-brand focus:ring-brand cursor-pointer
          "
        />

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="To-do"
          className={`
            w-full bg-transparent border-none p-0
            focus:ring-0
            ${checked ? 'text-gray-500 line-through' : 'text-gray-100'}
          `}
        />
      </div>
    </div>
  );
};

export default TodoBlock;
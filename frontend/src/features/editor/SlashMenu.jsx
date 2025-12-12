import React, { useEffect, useState, forwardRef } from 'react';
import { Heading1, Heading2, CheckSquare, Image as ImageIcon } from 'lucide-react';

const COMMANDS = [
  { id: 'header-one', label: 'Heading 1', icon: Heading1, type: 'block' },
  { id: 'header-two', label: 'Heading 2', icon: Heading2, type: 'block' }, // Cần thêm style CSS cho h2
  { id: 'todo', label: 'To-do List', icon: CheckSquare, type: 'convert', target: 'todo' },
  { id: 'image', label: 'Image', icon: ImageIcon, type: 'insert', target: 'image' },
];

const SlashMenu = forwardRef(({ position, onSelect, onClose }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Xử lý bàn phím để chọn menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % COMMANDS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + COMMANDS.length) % COMMANDS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(COMMANDS[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, onClose]);

  if (!position) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 w-60 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl overflow-hidden"
      style={{ top: position.top + 24, left: position.left }}
    >
      <div className="p-1">
        <div className="text-xs text-gray-500 px-2 py-1">Basic blocks</div>
        {COMMANDS.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              w-full flex items-center px-2 py-1.5 text-sm rounded
              ${index === selectedIndex ? 'bg-brand text-white' : 'text-gray-300 hover:bg-neutral-700'}
            `}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
});

export default SlashMenu;
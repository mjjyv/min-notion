import React, { useEffect, useState, forwardRef } from 'react';
import { 
  Heading1, 
  Heading2, 
  CheckSquare, 
  Image as ImageIcon, 
  Type 
} from 'lucide-react';

const COMMANDS = [
  { 
    id: 'header-one', 
    label: 'Heading 1', 
    icon: Heading1, 
    type: 'block',
    description: 'Big section heading'
  },
  { 
    id: 'header-two', 
    label: 'Heading 2', 
    icon: Heading2, 
    type: 'block',
    description: 'Medium section heading'
  },
  { 
    id: 'todo', 
    label: 'To-do List', 
    icon: CheckSquare, 
    type: 'convert', 
    target: 'todo',
    description: 'Track tasks with a to-do list'
  },
  { 
    id: 'image', 
    label: 'Image', 
    icon: ImageIcon, 
    type: 'insert', 
    target: 'image',
    description: 'Upload or embed with a link'
  }
];

const SlashMenu = forwardRef(({ position, onSelect, onClose, query }, ref) => {
  // Lọc lệnh dựa trên text người dùng gõ sau dấu /
  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection khi danh sách lệnh thay đổi
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands.length]);

  // Xử lý bàn phím
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filteredCommands.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(filteredCommands[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, onSelect, onClose]);

  if (!position) return null;
  if (filteredCommands.length === 0) return null;

  return (
    <div
      ref={ref}
      className="absolute z-50 w-72 bg-neutral-800 border border-neutral-700 rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[300px] overflow-y-auto"
      style={{ top: position.top, left: position.left }}
      // QUAN TRỌNG: Ngăn Editor mất focus khi click vào menu
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="p-1.5 space-y-0.5">
        <div className="text-[10px] uppercase font-bold text-gray-500 px-2 py-1 select-none">
          Basic blocks
        </div>
        {filteredCommands.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              w-full flex items-center px-2 py-2 text-sm rounded transition-colors
              ${index === selectedIndex ? 'bg-neutral-700 text-white' : 'text-gray-300 hover:bg-neutral-700'}
            `}
          >
            <div className="shrink-0 mr-3 border border-neutral-600 rounded p-1 bg-neutral-800">
               <item.icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate">{item.label}</span>
               <span className="text-xs text-gray-500 truncate">{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
export default SlashMenu;
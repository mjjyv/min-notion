import React from 'react';
import { NotebookText, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn'; // (Sử dụng tiện ích classname)

const PageItem = ({ page, removePage, onSelect, isActive }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
      removePage(page._id);
    }
  };

  const handleSelect = () => {
    onSelect(page._id);
  };

  // 1. Lớp CSS cho container (xử lý nền)
  const baseClasses = cn(
    'flex items-center justify-between w-full',
    'px-3 text-sm rounded-md',
    'cursor-pointer group transition-colors duration-150',
    isActive
      ? 'bg-neutral-700' // Nền khi Active
      : 'hover:bg-neutral-700' // Nền khi Hover
  );

  // 2. Lớp CSS cho Icon
  const iconClasses = cn(
    'h-4 w-4 mr-2 flex-shrink-0',
    isActive
      ? 'text-white' // Icon khi Active
      : 'text-gray-400 group-hover:text-white' // Icon khi Base/Hover
  );

  // 3. Lớp CSS cho Text (Label)
  const textClasses = cn(
    'truncate',
    isActive
      ? 'text-white font-medium' // Text khi Active (in đậm hơn)
      : 'text-gray-300 group-hover:text-white' // Text khi Base/Hover
  );

  return (
    <div onClick={handleSelect} className={baseClasses}>
      {/* Icon và Tên trang */}
      <div className="flex items-center truncate">
        <NotebookText className={iconClasses} />
        <span className={textClasses}>{page.title}</span>
      </div>

      {/* Nút Xóa (hover-to-show) */}
      <button
        onClick={handleDelete}
        className="
          p-1 rounded text-gray-400
          hover:text-red-400 hover:bg-neutral-600
          opacity-0 group-hover:opacity-100 
          transition-opacity shrink-0
        "
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PageItem;
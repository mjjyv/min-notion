import React from 'react';
import { NotebookText, Trash2 } from 'lucide-react';

// Cập nhật: Chấp nhận 'onSelect' và 'isActive'
const PageItem = ({ page, removePage, onSelect, isActive }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
      removePage(page._id);
    }
  };

  // Cập nhật: Gọi onSelect khi click
  const handleSelect = () => {
    onSelect(page._id);
  };

  return (
    <div
      onClick={handleSelect}
      className={`
        flex items-center justify-between w-full
        px-3 py-2 text-sm rounded-md 
        cursor-pointer group
        transition-colors duration-150
        
        /* Cập nhật: Thay đổi màu dựa trên 'isActive' */
        hover:bg-neutral-700
        ${isActive ? 'bg-neutral-700' : 'bg-transparent'}
      `}
    >
      <div className="flex items-center truncate">
        <NotebookText className="h-4 w-4 mr-2 shrink-0 text-gray-400" />
        <span className={`truncate ${isActive ? 'text-white' : 'text-gray-100'}`}>
          {page.title}
        </span>
      </div>

      <button
        onClick={handleDelete}
        className="
          p-1 rounded 
          text-gray-400
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
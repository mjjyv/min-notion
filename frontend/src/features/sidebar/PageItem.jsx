import React from 'react';
import { NotebookText, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const PageItem = ({ page, removePage, onSelect, isActive }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    
    // YÊU CẦU 2: Thêm cảnh báo khi xóa từ sidebar
    if (window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
      removePage(page._id);
    }
  };

  const handleSelect = () => {
    onSelect(page._id);
  };

  const PageIcon = ({ icon }) => {
    const iconClasses = cn(
      'h-4 w-4 mr-2 flex-shrink-0',
      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
    );
    if (!icon) {
      return <NotebookText className={iconClasses} />;
    }
    return <span className="h-4 w-4 mr-2 shrink-0">{icon}</span>;
  };

  const baseClasses = cn(
    'flex items-center justify-between w-full',
    'px-3 py-2 text-sm rounded-md',
    'cursor-pointer group transition-colors duration-150',
    isActive ? 'bg-neutral-700' : 'hover:bg-neutral-700'
  );

  const textClasses = cn(
    'truncate',
    isActive ? 'text-white font-medium' : 'text-gray-300 group-hover:text-white'
  );

  return (
    <div onClick={handleSelect} className={baseClasses}>
      <div className="flex items-center truncate">
        <PageIcon icon={page.icon} />
        <span className={textClasses}>{page.title}</span>
      </div>
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
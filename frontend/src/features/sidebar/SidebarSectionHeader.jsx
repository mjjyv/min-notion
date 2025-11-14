import React from 'react';
import { Plus } from 'lucide-react';

/**
 * Hiển thị tiêu đề (ví dụ: "Private", "Shared")
 * - onAdd: Một hàm (callback) để gọi khi nhấn dấu cộng.
 * - label: Tiêu đề (string).
 */
const SidebarSectionHeader = ({ label, onAdd }) => {
  return (
    // 1. Sử dụng 'group' để điều khiển các phần tử con khi hover
    <div
      className="flex items-center justify-between px-3 py-1 
                 text-xs font-medium text-gray-500 
                 rounded-md group hover:bg-neutral-700 
                 transition-colors duration-150 cursor-default"
    >
      <span>{label}</span>

      {/* 2. Nút "Add new" (dấu cộng) */}
      <button
        onClick={onAdd}
        className="
          p-1 text-gray-400 rounded 
          hover:bg-neutral-600 hover:text-white
          
          /* 3. Logic Hover-to-Show:
             - Mặc định ẩn (opacity-0)
             - Khi 'group' (div cha) được hover -> Hiện (opacity-100)
             - Thêm hiệu ứng trễ (transition-delay) như yêu cầu
          */
          opacity-0 group-hover:opacity-100 
          transition-opacity transition-delay-75
        "
        title="New Page"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default SidebarSectionHeader;
import React from 'react';
import { usePages } from '../../hooks/usePages';
import PageItem from './PageItem';
import UserProfilePopover from './UserProfilePopover'; // <-- Thay thế
import SidebarLink from './SidebarLink';
import {
  Loader2,
  Plus,
  AlertTriangle,
  Search,
  Home,
  Settings,
  Trash,
} from 'lucide-react';

// Cập nhật: Chấp nhận props 'onSelectPage' và 'selectedPageId'
const Sidebar = ({ onSelectPage, selectedPageId }) => {
  const { pages, isLoading, error, addNewPage, removePage } = usePages();

  const handleAddNewPage = async () => {
    const newPage = await addNewPage('Untitled');
    if (newPage) {
      onSelectPage(newPage._id); // Tự động chọn trang mới tạo
    }
  };

  const renderPageList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-20">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      );
    }
    if (error) {
      return (
        <div className="px-3 py-2 text-red-300 bg-red-900/50 rounded-md m-2">
          <AlertTriangle className="h-4 w-4 inline mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      );
    }
    if (pages.length === 0) {
      return (
        <p className="px-3 py-2 text-sm text-gray-500">No pages found.</p>
      );
    }
    
    // Cập nhật: Truyền 'onSelect' và 'isActive'
    return pages.map((page) => (
      <PageItem
        key={page._id}
        page={page}
        removePage={removePage}
        onSelect={onSelectPage}
        isActive={selectedPageId === page._id}
      />
    ));
  };

  return (
    <div className="w-64 h-full bg-neutral-800 border-r border-neutral-700 p-3 flex flex-col">
      {/* 1. Workspace Switcher (Đã bao gồm Popover Logout) */}
      <UserProfilePopover />

      {/* 2. Điều hướng & Truy cập nhanh */}
      <div className="mt-4 space-y-1">
        <SidebarLink icon={Search} label="Search" />
        {/* Cập nhật: onClick để quay về "Home" (Dashboard) */}
        <SidebarLink
          icon={Home}
          label="Home"
          onClick={() => onSelectPage(null)}
        />
      </div>

      {/* 3. Quản lý Trang (Private) */}
      <div className="mt-6">
        <div className="flex items-center justify-between px-3 mb-1">
          <span className="text-xs font-medium text-gray-500">Private</span>
          <button
            onClick={handleAddNewPage}
            className="p-1 text-gray-400 rounded hover:bg-neutral-700 hover:text-white"
            title="New Page"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {renderPageList()}
        </div>
      </div>

      {/* 4. Ứng dụng & Hệ thống (Xóa nút Logout tạm thời) */}
      <div className="mt-auto space-y-1">
        <SidebarLink icon={Settings} label="Settings" />
        <SidebarLink icon={Trash} label="Trash" />
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { usePages } from '../../hooks/usePages';
import PageItem from './PageItem';
import UserProfilePopover from './UserProfilePopover';
import SidebarLink from './SidebarLink';
import SidebarSectionHeader from './SidebarSectionHeader';
import {
  Loader2,
  AlertTriangle,
  Search,
  Home,
  Settings,
  Trash,
  MessageSquare,
  Users,
} from 'lucide-react';

const Sidebar = ({ onSelectPage, selectedPageId }) => {
  const { pages, isLoading, error, addNewPage, removePage } = usePages();

  const handleAddNewPage = async () => {
    const newPage = await addNewPage('Untitled');
    if (newPage) {
      onSelectPage(newPage._id);
    }
  };

  const renderPageList = () => {
    // ... (logic render giữ nguyên, không thay đổi)
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
    <div className="w-64 h-full bg-neutral-800 border-r border-neutral-700 
                    p-3 flex flex-col">
      
      <UserProfilePopover />

      {/* CẬP NHẬT: Truyền prop 'isActive' */}
      <div className="mt-4 space-y-1">
        <SidebarLink
          icon={Search}
          label="Search"
          isActive={false} // (Tương lai: 'isActive' khi đang tìm kiếm)
        />
        <SidebarLink
          icon={Home}
          label="Home"
          onClick={() => onSelectPage(null)}
          isActive={selectedPageId === null} // <-- Active khi ở trang chủ
        />
        <SidebarLink
          icon={Users}
          label="Meetings"
          isActive={false} // (Tương lai: 'isActive' khi ở trang meetings)
        />
        <SidebarLink
          icon={MessageSquare}
          label="Inbox"
          isActive={false} // (Tương lai: 'isActive' khi ở trang inbox)
        />
      </div>

      <div className="mt-6">
        <SidebarSectionHeader label="Shared" onAdd={() => alert('Add Shared Page')} />
        {/* (Render danh sách Shared) */}
      </div>

      <div className="mt-4">
        <SidebarSectionHeader label="Private" onAdd={handleAddNewPage} />
        <div className="flex-1 overflow-y-auto space-y-1 mt-1">
          {renderPageList()}
        </div>
      </div>

      <div className="mt-auto space-y-1">
        <SidebarLink icon={Settings} label="Settings" isActive={false} />
        <SidebarLink icon={Trash} label="Trash" isActive={false} />
      </div>
    </div>
  );
};

export default Sidebar;
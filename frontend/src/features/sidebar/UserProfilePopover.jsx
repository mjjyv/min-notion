import React, { useState } from 'react'; // Thêm useState
import * as Popover from '@radix-ui/react-popover';
import { useAuth } from '../../contexts/AuthContext';
import { logout as apiLogout } from '../../api/authApi';
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react'; // Thêm icon Settings
import SettingsModal from '../../features/settings/SettingsModal'; // Import Modal

// Tách riêng Trigger (Nút bấm)
const WorkspaceSwitcher = React.forwardRef(({ user, ...props }, ref) => (
  <button
    ref={ref}
    {...props}
    className="flex items-center justify-between w-full px-3 py-2 text-sm 
               text-gray-100 rounded-md 
               hover:bg-neutral-700 transition-colors duration-150"
  >
    <div className="flex items-center truncate">
      {/* Hiển thị Avatar nhỏ ở đây nếu có */}
      {user?.avatar ? (
        <img src={user.avatar} alt="Avt" className="w-5 h-5 rounded-sm mr-2 object-cover" />
      ) : (
        <div className="w-5 h-5 rounded-sm mr-2 bg-neutral-600 flex items-center justify-center text-xs font-bold text-white">
           {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <span className="font-medium truncate">
        {user ? `${user.name}'s Notion` : 'Workspace'}
      </span>
    </div>
    <ChevronsUpDown className="h-4 w-4 text-gray-400" />
  </button>
));

// Component Popover chính
const UserProfilePopover = () => {
  const { user, dispatch } = useAuth();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <>
      <Popover.Root>
        {/* 1. Trigger (Nút bấm) */}
        <Popover.Trigger asChild>
          <WorkspaceSwitcher user={user} />
        </Popover.Trigger>

        <Popover.Portal>
          {/* 2. Content (Nội dung Popover) */}
          <Popover.Content
            sideOffset={5}
            align="start"
            className="w-64 bg-neutral-800 border border-neutral-700 
                      rounded-md shadow-lg z-50 p-2
                      data-[state=open]:animate-in data-[state=open]:fade-in
                      data-[state=closed]:animate-out data-[state=closed]:fade-out"
          >
            {/* Thông tin User */}
            <div className="px-2 py-1">
              <p className="text-xs text-gray-400">Đăng nhập với</p>
              <p className="text-sm font-medium text-gray-100 truncate">
                {user?.email}
              </p>
            </div>

            <div className="w-full h-px bg-neutral-700 my-2" />

            {/* 1. Nút mở Settings */}
              <button
                onClick={() => setIsSettingsOpen(true)} // Mở modal
                className="flex items-center w-full px-2 py-2 text-sm text-gray-300 rounded-md 
                          hover:bg-neutral-700 hover:text-white 
                          transition-colors duration-150 group"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings & members</span>
              </button>

            {/* Nút Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm text-gray-300 rounded-md 
                        hover:bg-neutral-700 hover:text-white 
                        transition-colors duration-150 group"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Đăng xuất</span>
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* 3. Render Settings Modal */}
      <SettingsModal 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </>
  );
};

export default UserProfilePopover;
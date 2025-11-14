import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { logout as apiLogout } from '../../api/authApi';
import { ChevronsUpDown, LogOut } from 'lucide-react'; // Icon
import { Button } from '../../components/ui/Button';

// (Trong tương lai, component này sẽ dùng Popover của Radix UI)
const WorkspaceSwitcher = () => {
  const { user, dispatch } = useAuth();

  // Logic Logout (chuyển từ WorkspacePage về đây)
  const handleLogout = async () => {
    // Tạm thời, chúng ta sẽ log out trực tiếp
    // (Trong tương lai, đây là nút "Logout" bên trong Popover)
    if (!window.confirm('Bạn có muốn đăng xuất? (Tương lai đây sẽ là Popover)')) return;

    try {
      await apiLogout();
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    // Nút bấm chính để mở Popover (giống Notion)
    <button
      className="flex items-center justify-between w-full px-3 py-2 text-sm 
                 text-gray-100 rounded-md 
                 hover:bg-neutral-700 transition-colors duration-150"
    >
      {/* Tên Workspace/Người dùng */}
      <span className="font-medium truncate">
        {user ? `${user.name}'s Notion` : 'Workspace'}
      </span>
      {/* Icon mũi tên (chỉ báo có thể bấm) */}
      <ChevronsUpDown className="h-4 w-4 text-gray-400" />

      {/* PHẦN TƯƠNG LAI:
        Nội dung Popover sẽ nằm ở đây. 
        Hiện tại, chúng ta thêm 1 nút Logout riêng ở dưới (xem Sidebar.jsx)
      */}
    </button>
  );
};

export default WorkspaceSwitcher;
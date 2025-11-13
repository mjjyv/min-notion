import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logout as apiLogout } from '../api/authApi';
import { Button } from '../components/ui/Button';
import { NotebookText, LogOut } from 'lucide-react'; // Thêm icon

const WorkspacePage = () => {
  const { user, dispatch } = useAuth();

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
    // Bố cục App Shell
    <div className="min-h-screen bg-gray-50">
      
      {/* 1. Header Cố định */}
      <header className="sticky top-0 bg-white shadow-sm border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center text-brand-dark">
              <NotebookText className="h-6 w-6 mr-2" />
              <span className="font-bold text-lg text-gray-900">Mini-Notion</span>
            </div>

            {/* User Menu & Logout */}
            <div className="flex items-center space-x-4">
              {/* Tương phản TỐT: text-gray-600 (xám) trên nền white */}
              <span className="text-sm text-gray-600 hidden sm:block">
                Chào mừng, {user ? user.name : 'User'}!
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Vùng Nội dung chính */}
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Box nội dung placeholder (trên nền bg-gray-50) */}
          <div className="p-10 bg-white rounded-lg shadow-md">
            {/* Tương phản TỐT: text-gray-900/700 trên nền white */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Workspace
            </h2>
            <p className="text-gray-700 mb-2">
              Đây là khu vực được bảo vệ.
            </p>
            <p className="text-gray-700">
              Nội dung Mini-Notion (Sidebar và Editor) sẽ hiển thị ở đây (Giai
              đoạn 3).
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
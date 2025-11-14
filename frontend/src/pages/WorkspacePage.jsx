import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Hook (Auth)
import { usePages } from '../hooks/usePages'; // Hook (Data)
import Sidebar from '../features/sidebar/Sidebar';
import { Loader2, FileText, Image, Smile } from 'lucide-react';

// --- TÁCH BIỆT COMPONENT CON (UI) ---

// 1. Giao diện "Home" Dashboard
const HomeDashboard = ({ user, pages, isLoading, onSelectPage }) => {
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return `Good morning, ${user ? user.name : 'User'}`;
    if (hours < 18) return `Good afternoon, ${user ? user.name : 'User'}`;
    return `Good evening, ${user ? user.name : 'User'}`;
  };

  const RecentPageCard = ({ page, onSelect }) => (
    <div
      onClick={() => onSelect(page._id)}
      className="p-4 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors cursor-pointer"
    >
      <FileText className="h-5 w-5 mb-2 text-gray-400" />
      <span className="text-sm text-gray-100 line-clamp-1">{page.title}</span>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        {getGreeting()}
      </h1>
      <h2 className="text-lg font-medium text-gray-200 mb-4">
        Recently visited
      </h2>
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pages.slice(0, 4).map((page) => (
            <RecentPageCard key={page._id} page={page} onSelect={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Giao diện "Page Detail" (Nền tảng cho Giai đoạn 4)
const PageDetail = ({ pageId, pages }) => {
  const page = pages.find((p) => p._id === pageId);

  if (!page) {
    // Xử lý trường hợp trang bị xóa hoặc không tìm thấy
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-400">Page not found.</p>
      </div>
    );
  }

  // Đây là nơi Giai đoạn 4 sẽ bắt đầu
  return (
    <div className="max-w-3xl mx-auto">
      {/* Tương lai: Cover Image */}
      <div className="h-32 group">
        <button className="hidden group-hover:flex items-center text-sm text-gray-300 bg-neutral-800/50 rounded px-2 py-1 absolute top-20 right-20">
          <Image className="h-4 w-4 mr-1" /> Add cover
        </button>
      </div>

      {/* Tương lai: Icon */}
      <div className="px-4">
        <button className="text-4xl mb-4 hover:bg-neutral-700 rounded p-1">
          <Smile className="h-10 w-10 text-gray-400" />
        </button>
      </div>

      {/* Tiêu đề (Chuẩn bị cho GĐ 4: contentEditable) */}
      <h1
        className="text-4xl font-bold text-gray-100 mb-8 px-4 outline-none"
        contentEditable={true} // Bật tính năng chỉnh sửa
        suppressContentEditableWarning={true} // Tắt cảnh báo của React
      >
        {page.title}
      </h1>

      {/* Tương lai: Trình soạn thảo (Block Editor) */}
      <div className="min-h-[400px] px-4">
        <p className="text-gray-500">
          (Giai đoạn 4: Trình soạn thảo Draft.js sẽ bắt đầu ở đây...)
        </p>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH (QUẢN LÝ STATE) ---

const WorkspacePage = () => {
  // 1. Quản lý State (Cấp cao nhất)
  const { user } = useAuth();
  const {
    pages,
    isLoading: pagesLoading,
    error,
    addNewPage,
    removePage,
  } = usePages(); // Gọi hook MỘT LẦN

  const [selectedPageId, setSelectedPageId] = useState(null);
  const handleSelectPage = (id) => setSelectedPageId(id);

  return (
    <div className="flex h-screen bg-neutral-900 overflow-hidden">
      
      {/* 2. Sidebar (Truyền props xuống) */}
      <nav className="shrink-0 overflow-y-auto">
        <Sidebar
          // Quản lý trang
          pages={pages}
          isLoading={pagesLoading}
          error={error}
          addNewPage={addNewPage}
          removePage={removePage}
          // Quản lý state (chọn trang)
          onSelectPage={handleSelectPage}
          selectedPageId={selectedPageId}
        />
      </nav>

      {/* 3. Main Content (Render có điều kiện) */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        {!selectedPageId ? (
          // Hiển thị "Home" Dashboard
          <HomeDashboard
            user={user}
            pages={pages}
            isLoading={pagesLoading}
            onSelectPage={handleSelectPage}
          />
        ) : (
          // Hiển thị "Page Detail"
          <PageDetail pageId={selectedPageId} pages={pages} />
        )}
      </main>
    </div>
  );
};

export default WorkspacePage;
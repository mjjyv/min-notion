import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../features/sidebar/Sidebar';
import { usePages } from '../hooks/usePages';
import { Loader2, FileText } from 'lucide-react';

// --- Components nội bộ cho Dashboard (Giữ nguyên) ---

const RecentPageCard = ({ page, onSelect }) => (
  <div
    onClick={() => onSelect(page._id)} // <-- Cập nhật: Cho phép click
    className="p-4 bg-neutral-800 rounded-lg 
               hover:bg-neutral-700 transition-colors cursor-pointer"
  >
    <FileText className="h-5 w-5 mb-2 text-gray-400" />
    <span className="text-sm text-gray-100 line-clamp-1">{page.title}</span>
  </div>
);

// --- Component mới: Placeholder cho Editor ---

const PageDetail = ({ pageId, pages }) => {
  // Tìm trang từ danh sách đã tải (tối ưu, không cần fetch lại)
  const page = pages.find(p => p._id === pageId);

  if (!page) {
    return <div className="text-gray-100">Page not found or deleted.</div>;
  }

  // Đây là nơi Giai đoạn 4 sẽ hiển thị Editor
  return (
    <div className="w-full mx-auto">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">{page.title}</h1>
      <div className="h-64 bg-neutral-800 rounded-md p-4">
        <p className="text-gray-400">(Editor placeholder for Giai đoạn 4)</p>
        <pre className="text-xs text-gray-500 mt-4">
          {JSON.stringify(page.content, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// --- Component chính (Dashboard) ---

const HomeDashboard = ({ pages, isLoading, onSelectPage }) => {
  const { user } = useAuth();
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return `Good morning, ${user ? user.name : 'User'}`;
    if (hours < 18) return `Good afternoon, ${user ? user.name : 'User'}`;
    return `Good evening, ${user ? user.name : 'User'}`;
  };

  return (
    <div className="w-full mx-auto">
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
          {/* YÊU CẦU 3: Bỏ NewPageCard ở đây */}
          {pages.slice(0, 4).map((page) => (
            <RecentPageCard key={page._id} page={page} onSelect={onSelectPage} />
          ))}
        </div>
      )}
    </div>
  );
};


// --- Component WorkspacePage (Quản lý chính) ---

const WorkspacePage = () => {
  // 1. Quản lý trạng thái trang được chọn
  const [selectedPageId, setSelectedPageId] = useState(null);
  const handleSelectPage = (id) => setSelectedPageId(id);

  // 2. Lấy dữ liệu trang
  const { pages, isLoading: pagesLoading } = usePages();

  return (
    <div className="flex h-screen w-screen bg-neutral-900 overflow-hidden">
      
      {/* 1. Sidebar (Truyền state và hàm xử lý) */}
      <nav className="shrink-0 overflow-y-auto">
        <Sidebar
          onSelectPage={handleSelectPage}
          selectedPageId={selectedPageId}
        />
      </nav>

      {/* 2. Main Content (Render có điều kiện) */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        {
          // KIỂM TRA TÍCH HỢP GĐ 3:
          // Nếu không có trang nào được chọn -> Hiển thị Dashboard
          !selectedPageId ? (
            <HomeDashboard
              pages={pages}
              isLoading={pagesLoading}
              onSelectPage={handleSelectPage}
            />
          ) : (
          // Nếu có trang được chọn -> Hiển thị "Editor"
            <PageDetail 
              pageId={selectedPageId} 
              pages={pages} 
            />
          )
        }
      </main>
    </div>
  );
};

export default WorkspacePage;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePages } from '../hooks/usePages';
import Sidebar from '../features/sidebar/Sidebar';
import { getPageDetail, updatePage } from '../api/pageApi';
import CoreEditor from '../features/editor/CoreEditor';
// import useDebounce from '../hooks/useDebounce';
import EmojiPicker from 'emoji-picker-react';
import {
  Loader2,
  FileText,
  Image,
  Smile,
  AlertTriangle,
  Trash2,
} from 'lucide-react';
import { Button } from '../components/ui/Button';

// --- COMPONENT CON 1: "HOME" DASHBOARD ---
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

// --- COMPONENT CON 2: "PAGE DETAIL" ---
const PageDetail = ({ pageId, onUpdatePageInList, onDeletePage }) => {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [currentTitle, setCurrentTitle] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);
  // const debouncedTitle = useDebounce(currentTitle, 750);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!pageId) return;
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      setShowIconPicker(false);
      try {
        const data = await getPageDetail(pageId);
        
        // Sửa lỗi (Lỗi 2): Trang mới không có nội dung
        if (data.content.length === 0) {
          data.content = [{ type: 'text', data: {} }];
        }
        
        setPageData(data);
        // setCurrentTitle(data.title);
      } catch (err) {
        setError(err.message || 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);



  const handleUpdatePage = async (data) => {
    if (!pageData) return;
    try {
      const updatedPage = await updatePage(pageData._id, data);
      setPageData(updatedPage);
      
      // Sửa lỗi (Lỗi 5): Đồng bộ hóa Sidebar
      if (data.title || data.icon) {
        onUpdatePageInList(updatedPage);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleCoverImage = () => {
    const url = prompt("Enter image URL:", pageData.coverImage || '');
    if (url !== null) {
      handleUpdatePage({ coverImage: url || null });
    }
  };

  const onEmojiClick = (emojiObject) => {
    handleUpdatePage({ icon: emojiObject.emoji });
    setShowIconPicker(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${pageData.title}"?`)) {
      onDeletePage(pageData._id); // Gọi hàm từ (Lỗi 4)
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-40">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-full pt-40">
        <AlertTriangle className="h-10 w-10 text-red-400 mb-4" />
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center h-full pt-40">
        <p className="text-gray-400">Page not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="h-48 group relative">
        {pageData.coverImage && (
          <img
            src={pageData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover rounded-b-lg"
          />
        )}
        <Button
          variant="ghost"
          size="sm"
          className={`
            absolute bottom-4 right-4 text-xs
            bg-neutral-800/50 text-gray-200 hover:bg-neutral-700
            ${pageData.coverImage ? 'opacity-0 group-hover:opacity-100' : ''}
          `}
          onClick={handleCoverImage}
        >
          <Image className="h-4 w-4 mr-1" />
          {pageData.coverImage ? 'Change cover' : 'Add cover'}
        </Button>
      </div>

      <div className="px-12 relative flex justify-between items-center">
        <div className="relative w-20 h-20 -mt-10">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="text-4xl w-20 h-20 hover:bg-neutral-700 rounded p-1
                       flex items-center justify-center"
          >
            {pageData.icon ? (
              <span className="text-5xl">{pageData.icon}</span>
            ) : (
              <Smile className="h-10 w-10 text-gray-400" />
            )}
          </button>
          {showIconPicker && (
            <div className="absolute top-full left-0 z-50 mt-2">
              <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-red-400 mt-2"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* YÊU CẦU 1: Cập nhật chức năng Lưu tên trang */}
      <h1
        key={pageData._id} // <-- QUAN TRỌNG: Buộc React reset <h1> khi đổi trang
        className="text-4xl font-bold text-gray-100 mt-4 mb-8 px-12 outline-none"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={(e) => { // <-- Lưu khi mất focus
          const newTitle = e.currentTarget.textContent || 'Untitled';
          if (newTitle !== pageData.title) {
            handleUpdatePage({ title: newTitle });
          }
        }}
      >
        {pageData.title}
      </h1>

      <CoreEditor
        pageId={pageData._id}
        initialContent={pageData.content}
      />
    </div>
  );
};

// --- COMPONENT CHÍNH (QUẢN LÝ STATE) ---
const WorkspacePage = () => {
  const { user } = useAuth();
  const {
    pages,
    isLoading: pagesLoading,
    error,
    addNewPage,
    removePage: removePageFromHook, // Đổi tên hook gốc
    updatePageInList,
  } = usePages();

  const [selectedPageId, setSelectedPageId] = useState(null);
  const handleSelectPage = (id) => setSelectedPageId(id);

  // Sửa lỗi (Lỗi 4): Logic xóa đồng bộ hóa
  const handleDeletePage = useCallback(
    async (pageId) => {
      await removePageFromHook(pageId);
      if (selectedPageId === pageId) {
        setSelectedPageId(null);
      }
    },
    [removePageFromHook, selectedPageId],
  );

  return (
    <div className="flex h-screen bg-neutral-900 overflow-hidden">
      <nav className="shrink-0 overflow-y-auto">
        <Sidebar
          pages={pages}
          isLoading={pagesLoading}
          error={error}
          addNewPage={addNewPage}
          removePage={handleDeletePage}
          onSelectPage={handleSelectPage}
          selectedPageId={selectedPageId}
          // (updatePageInList được truyền gián tiếp qua usePages)
        />
      </nav>

      <main className="flex-1 overflow-y-auto p-6 lg:p-12">
        {!selectedPageId ? (
          <HomeDashboard
            user={user}
            pages={pages}
            isLoading={pagesLoading}
            onSelectPage={handleSelectPage}
          />
        ) : (
          <PageDetail
            pageId={selectedPageId}
            onUpdatePageInList={updatePageInList}
            onDeletePage={handleDeletePage}
          />
        )}
      </main>
    </div>
  );
};

export default WorkspacePage;
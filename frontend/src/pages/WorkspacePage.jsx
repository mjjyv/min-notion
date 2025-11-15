import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePages } from '../hooks/usePages';
import Sidebar from '../features/sidebar/Sidebar';
import { getPageDetail } from '../api/pageApi';
import CoreEditor from '../features/editor/CoreEditor';
import {
  Loader2,
  FileText,
  Image,
  Smile,
  AlertTriangle,
} from 'lucide-react';

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
const PageDetail = ({ pageId }) => {
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageId) return;
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPageDetail(pageId);
        setPageData(data);
      } catch (err) {
        setError(err.message || 'Failed to load page');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
  }, [pageId]);

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
      <div className="h-32 group">
        <button className="hidden group-hover:flex items-center text-sm text-gray-300 bg-neutral-800/50 rounded px-2 py-1 absolute top-20 right-20">
          <Image className="h-4 w-4 mr-1" /> Add cover
        </button>
      </div>
      <div className="px-4">
        <button className="text-4xl mb-4 hover:bg-neutral-700 rounded p-1">
          <Smile className="h-10 w-10 text-gray-400" />
        </button>
      </div>
      <h1
        className="text-4xl font-bold text-gray-100 mb-8 px-4 outline-none"
        contentEditable={true}
        suppressContentEditableWarning={true}
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
  const { pages, isLoading: pagesLoading, error, addNewPage, removePage } =
    usePages();

  const [selectedPageId, setSelectedPageId] = useState(null);
  const handleSelectPage = (id) => setSelectedPageId(id);

  return (
    <div className="flex h-screen w-screen bg-neutral-900 overflow-hidden">
      <nav className="shrink-0 overflow-y-auto">
        <Sidebar
          pages={pages}
          isLoading={pagesLoading}
          error={error}
          addNewPage={addNewPage}
          removePage={removePage}
          onSelectPage={handleSelectPage}
          selectedPageId={selectedPageId}
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
          <PageDetail pageId={selectedPageId} />
        )}
      </main>
    </div>
  );
};

export default WorkspacePage;
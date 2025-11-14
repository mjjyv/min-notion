import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs'; // Drag-and-Drop
import { useDebounce } from '../../hooks/useDebounce';
import { updatePageContent } from '../../api/pageApi';
import TextBlock from './TextBlock';
import TodoBlock from './TodoBlock';
import { Plus } from 'lucide-react';

const CoreEditor = ({ pageId, initialContent }) => {
  const [blocks, setBlocks] = useState(initialContent);
  const debouncedBlocks = useDebounce(blocks, 1000); // Trì hoãn 1 giây

  // 1. Logic Auto-Save
  useEffect(() => {
    // Chỉ lưu nếu 'debouncedBlocks' thay đổi (và không phải là giá trị ban đầu)
    if (debouncedBlocks !== initialContent) {
      console.log('Auto-saving...', pageId);
      updatePageContent(pageId, debouncedBlocks)
        .catch(err => console.error("Auto-save failed:", err));
    }
  }, [debouncedBlocks, pageId, initialContent]);

  // 2. Hàm cập nhật nội dung từ các Block con
  const handleContentChange = useCallback((blockId, newData) => {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block._id === blockId ? { ...block, data: newData } : block
      )
    );
  }, []);

  // 3. Hàm render Block (dựa trên type)
  const renderBlock = (block) => {
    switch (block.type) {
      case 'text':
        return <TextBlock block={block} onContentChange={handleContentChange} />;
      case 'todo':
        return <TodoBlock block={block} onContentChange={handleContentChange} />;
      default:
        return <p className="text-red-500">Unknown block type</p>;
    }
  };
  
  // 4. Hàm thêm Block mới (Tạm thời)
  // (Trong tương lai, đây sẽ là Command Menu '/')
  const addBlock = (type) => {
    const newBlock = {
      _id: `temp_${Date.now()}`, // ID tạm
      type: type,
      data: type === 'todo' ? { text: '', checked: false } : {},
    };
    setBlocks([...blocks, newBlock]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 5. Vùng Drag-and-Drop (Sortable) */}
      <ReactSortable
        list={blocks}
        setList={setBlocks}
        animation={150}
        className="space-y-4"
        handle=".drag-handle" // (Sẽ thêm handle sau)
      >
        {blocks.map((block) => (
          <div key={block._id || block.temp_id} className="flex items-start">
            {/* (Placeholder cho Drag Handle)
            <span className="drag-handle cursor-grab text-gray-500 pr-2">⋮⋮</span> 
            */}
            {renderBlock(block)}
          </div>
        ))}
      </ReactSortable>

      {/* Nút thêm Block (Tạm thời) */}
      <div className="mt-4 border-t border-neutral-700 pt-4 space-x-2">
        <button
          onClick={() => addBlock('text')}
          className="px-3 py-1 text-sm bg-neutral-700 rounded hover:bg-neutral-600"
        >
          <Plus className="h-4 w-4 inline mr-1" /> Text
        </button>
        <button
          onClick={() => addBlock('todo')}
          className="px-3 py-1 text-sm bg-neutral-700 rounded hover:bg-neutral-600"
        >
          <Plus className="h-4 w-4 inline mr-1" /> Todo
        </button>
      </div>
    </div>
  );
};

export default CoreEditor;
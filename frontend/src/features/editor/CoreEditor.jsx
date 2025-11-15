import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import TextBlock from './TextBlock';
import TodoBlock from './TodoBlock';
import useDebounce from '../../hooks/useDebounce';
import { updatePageContent } from '../../api/pageApi';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

let tempIdCounter = 0;

// Helper: Gán ID tạm thời (client-only) cho React/Sortable
const initializeBlocks = (content) => {
  return content.map((block) => ({
    ...block,
    // Sử dụng _id (từ DB) nếu có, nếu không, tạo ID tạm
    tempClientId: block._id || `temp-${tempIdCounter++}`,
  }));
};

// Helper: Lọc bỏ ID tạm thời trước khi gửi lên DB
const getBlocksForSaving = (blocksToSave) => {
  return blocksToSave.map((block) => {
    const { tempClientId, ...blockForDB } = block;
    // Nếu _id là 'temp-...' (từ lỗi cũ), hãy xóa nó
    if (blockForDB._id && blockForDB._id.startsWith('temp-')) {
      delete blockForDB._id;
    }
    return blockForDB;
  });
};

const SaveStatusIndicator = ({ saveStatus }) => {
  // (Component này giữ nguyên, không thay đổi)
  let icon = <Check className="h-4 w-4" />;
  let text = 'Saved';
  if (saveStatus === 'Saving') {
    icon = <Loader2 className="h-4 w-4 animate-spin" />;
    text = 'Saving...';
  } else if (saveStatus === 'Error') {
    icon = <AlertTriangle className="h-4 w-4 text-red-400" />;
    text = 'Save failed';
  }
  return (
    <div className="flex items-center space-x-1 text-xs text-gray-400">
      {icon}
      <span>{text}</span>
    </div>
  );
};

const CoreEditor = ({ pageId, initialContent }) => {
  const [blocks, setBlocks] = useState(() =>
    initializeBlocks(initialContent || []),
  );
  const [saveStatus, setSaveStatus] = useState('Saved');
  const debouncedBlocks = useDebounce(blocks, 1000);

  // Cập nhật state khi đổi trang
  useEffect(() => {
    setBlocks(initializeBlocks(initialContent || []));
    setSaveStatus('Saved');
  }, [pageId, initialContent]);

  // Effect Tự động lưu
  useEffect(() => {
    // So sánh dữ liệu "sạch"
    const cleanInitialContent = getBlocksForSaving(initialContent || []);
    const cleanDebouncedBlocks = getBlocksForSaving(debouncedBlocks);

    const isDifferent =
      JSON.stringify(cleanInitialContent) !==
      JSON.stringify(cleanDebouncedBlocks);

    if (isDifferent) {
      const saveContent = async () => {
        setSaveStatus('Saving');
        try {
          const blocksToSave = getBlocksForSaving(debouncedBlocks);
          await updatePageContent(pageId, blocksToSave);
          setSaveStatus('Saved');
        } catch (err) {
          console.error('Auto-save failed:', err);
          setSaveStatus('Error');
        }
      };
      saveContent();
    }
  }, [debouncedBlocks, pageId, initialContent]);

  // Callback khi nội dung block con thay đổi
  const handleBlockChange = useCallback((tempClientId, newData) => {
    setSaveStatus('Saving');
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.tempClientId === tempClientId
          ? { ...block, data: newData }
          : block,
      ),
    );
  }, []);

  // Callback khi kéo-thả
  const onSortEnd = useCallback((newBlockList) => {
    setSaveStatus('Saving');
    setBlocks(newBlockList);
  }, []);

  // Hàm render từng block
  const renderBlock = (block) => {
    const props = {
      // Dùng ID tạm (tempClientId) làm ID và Key
      id: block.tempClientId,
      blockId: block.tempClientId, // Truyền xuống component con
      initialData: block.data,
      onChange: handleBlockChange,
    };
    switch (block.type) {
      case 'text':
        return <TextBlock key={block.tempClientId} {...props} />;
      case 'todo':
        return <TodoBlock key={block.tempClientId} {...props} />;
      default:
        return (
          <p key={block.tempClientId} id={block.tempClientId} className="text-red-400">
            Unknown block
          </p>
        );
    }
  };

  return (
    <div className="min-h-[400px] px-4 space-y-4">
      <div className="h-6">
        <SaveStatusIndicator saveStatus={saveStatus} />
      </div>
      <ReactSortable
        list={blocks}
        setList={onSortEnd}
        animation={150}
        className="space-y-4"
        key="sortable-editor"
      >
        {blocks.map(renderBlock)}
      </ReactSortable>
    </div>
  );
};

export default CoreEditor;
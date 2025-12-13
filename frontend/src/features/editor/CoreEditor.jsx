import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import TextBlock from './TextBlock';
import TodoBlock from './TodoBlock';
import ImageBlock from './ImageBlock';
import useDebounce from '../../hooks/useDebounce';
import { updatePageContent } from '../../api/pageApi';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

let tempIdCounter = 0;

// Helper: Kiểm tra xem Block text có rỗng không
const isBlockEmpty = (block) => {
  if (block.type !== 'text') return false;
  if (!block.data || !block.data.contentState) return true;
  try {
    const raw = JSON.parse(block.data.contentState);
    return raw.blocks.every((b) => b.text.trim() === '');
  } catch (e) {
    return true;
  }
};

const initializeBlocks = (content) => {
  return content.map((block) => ({
    ...block,
    tempClientId: block._id || `temp-${tempIdCounter++}`,
  }));
};

const getBlocksForSaving = (blocksToSave) => {
  return blocksToSave.map((block) => {
    const { tempClientId, ...blockForDB } = block;
    if (blockForDB._id && blockForDB._id.startsWith('temp-')) {
      delete blockForDB._id;
    }
    return blockForDB;
  });
};

const SaveStatusIndicator = ({ saveStatus }) => {
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
    initializeBlocks(initialContent || [])
  );
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [focusId, setFocusId] = useState(null); // State quản lý focus
  const debouncedBlocks = useDebounce(blocks, 1000);

  // --- LOGIC THÊM BLOCK MỚI ---
  const handleAddBlock = useCallback((currentBlockId) => {
    setBlocks((prev) => {
      const newId = `temp-${Date.now()}-${Math.random()}`;
      const newBlock = { tempClientId: newId, type: 'text', data: {} };

      const index = prev.findIndex((b) => b.tempClientId === currentBlockId);

      // Nếu không tìm thấy ID (hoặc null), thêm vào cuối
      if (index === -1) {
        setFocusId(newId);
        return [...prev, newBlock];
      }

      // Chèn vào ngay sau block hiện tại
      const newList = [...prev];
      newList.splice(index + 1, 0, newBlock);
      setFocusId(newId);
      return newList;
    });
  }, []);

  const handleRemoveBlock = useCallback((blockId) => {
    setBlocks((prev) => {
      if (prev.length <= 1) return prev;
      const index = prev.findIndex((b) => b.tempClientId === blockId);
      const newList = prev.filter((b) => b.tempClientId !== blockId);

      // Focus vào block phía trước
      if (index > 0) {
        setFocusId(newList[index - 1].tempClientId);
      }
      return newList;
    });
  }, []);

  const handleReplaceBlock = useCallback((tempClientId, newType, newData) => {
    setSaveStatus('Saving');
    setBlocks((prev) => {
      const index = prev.findIndex((b) => b.tempClientId === tempClientId);
      if (index === -1) return prev;
      const newList = [...prev];
      newList[index] = { ...newList[index], type: newType, data: newData };

      // Nếu là Image, thêm text block rỗng phía dưới để không bị kẹt
      if (newType === 'image') {
        const nextId = `temp-auto-${Date.now()}`;
        const nextBlock = { tempClientId: nextId, type: 'text', data: {} };
        newList.splice(index + 1, 0, nextBlock);
        setFocusId(nextId);
      }
      return newList;
    });
  }, []);

  useEffect(() => {
    setBlocks(initializeBlocks(initialContent || []));
    setSaveStatus('Saved');
  }, [pageId, initialContent]);

  useEffect(() => {
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

  const handleBlockChange = useCallback((tempClientId, newData) => {
    setSaveStatus('Saving');
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.tempClientId === tempClientId
          ? { ...block, data: newData }
          : block
      )
    );
  }, []);

  // --- FIX LỖI 1: CLICK VÙNG TRỐNG ---
  const handleBackgroundClick = (e) => {
    if (e.target !== e.currentTarget) return; // Chỉ xử lý click vào container cha

    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock) {
      // Nếu block cuối là text rỗng -> Focus nó, KHÔNG tạo mới
      if (isBlockEmpty(lastBlock)) {
        setFocusId(lastBlock.tempClientId);
      } else {
        // Nếu có chữ -> Tạo mới
        handleAddBlock(lastBlock.tempClientId);
      }
    } else {
      handleAddBlock(null);
    }
  };

  const onSortEnd = useCallback((newBlockList) => {
    setSaveStatus('Saving');
    setBlocks(newBlockList);
  }, []);

  const renderBlock = (block) => {
    const props = {
      id: block.tempClientId,
      blockId: block.tempClientId,
      initialData: block.data,
      onChange: handleBlockChange,
      onReplace: handleReplaceBlock,
      onAddBlock: handleAddBlock,
      onRemoveBlock: handleRemoveBlock,
      shouldFocus: focusId === block.tempClientId, // Truyền prop báo hiệu cần focus
    };
    switch (block.type) {
      case 'text':
        return <TextBlock key={block.tempClientId} {...props} />;
      case 'todo':
        return <TodoBlock key={block.tempClientId} {...props} />;
      case 'image':
        return <ImageBlock key={block.tempClientId} {...props} />;
      default:
        return (
          <p key={block.tempClientId} className="text-red-400">
            Unknown block
          </p>
        );
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-200px)] px-4 space-y-2 pb-40"
      onClick={handleBackgroundClick} // <-- FIX LỖI 1
    >
      <div className="h-6">
        <SaveStatusIndicator saveStatus={saveStatus} />
      </div>
      <ReactSortable
        list={blocks}
        setList={onSortEnd}
        animation={150}
        handle=".drag-handle"
        className="space-y-1"
        key="sortable-editor"
      >
        {blocks.map(renderBlock)}
      </ReactSortable>
    </div>
  );
};

export default CoreEditor;
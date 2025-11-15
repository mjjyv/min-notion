import React, { useState, useEffect, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import TextBlock from './TextBlock';
import TodoBlock from './TodoBlock';
import useDebounce from '../../hooks/useDebounce';
import { updatePageContent } from '../../api/pageApi';
import { Check, Loader2, AlertTriangle } from 'lucide-react';

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
  const [blocks, setBlocks] = useState(initialContent || []);
  const [saveStatus, setSaveStatus] = useState('Saved');
  const debouncedBlocks = useDebounce(blocks, 1000);

  useEffect(() => {
    setBlocks(initialContent || []);
    setSaveStatus('Saved'); // Reset status khi đổi trang
  }, [pageId, initialContent]);

  useEffect(() => {
    if (debouncedBlocks !== initialContent) {
      const saveContent = async () => {
        setSaveStatus('Saving');
        try {
          await updatePageContent(pageId, debouncedBlocks);
          setSaveStatus('Saved');
        } catch (err) {
          console.error('Auto-save failed:', err);
          setSaveStatus('Error');
        }
      };
      saveContent();
    }
  }, [debouncedBlocks, pageId, initialContent]);

  const handleBlockChange = useCallback((blockId, newData) => {
    setSaveStatus('Saving');
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block._id === blockId ? { ...block, data: newData } : block,
      ),
    );
  }, []);

  const onSortEnd = useCallback((newBlockList) => {
    setSaveStatus('Saving');
    setBlocks(newBlockList);
  }, []);

  const renderBlock = (block) => {
    const props = {
      id: block._id,
      blockId: block._id,
      initialData: block.data,
      onChange: handleBlockChange,
    };
    switch (block.type) {
      case 'text':
        return <TextBlock {...props} />;
      case 'todo':
        return <TodoBlock {...props} />;
      default:
        return <p id={block._id} className="text-red-400">Unknown block</p>;
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
      >
        {blocks.map(renderBlock)}
      </ReactSortable>
    </div>
  );
};

export default CoreEditor;
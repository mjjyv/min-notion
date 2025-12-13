import React, { useState, useEffect, useRef } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import FloatingToolbar from './FloatingToolbar';
import SlashMenu from './SlashMenu';
import { GripVertical } from 'lucide-react';

export const colorStyleMap = {
  TEXT_COLOR_DEFAULT: { color: 'inherit' },
  TEXT_COLOR_GRAY: { color: 'rgb(156 163 175)' },
  TEXT_COLOR_RED: { color: 'rgb(248 113 113)' },
  TEXT_COLOR_BLUE: { color: 'rgb(96 165 250)' },
  BG_COLOR_DEFAULT: { backgroundColor: 'inherit' },
  BG_COLOR_YELLOW: { backgroundColor: 'rgba(253, 224, 71, 0.5)' },
  BG_COLOR_GREEN: { backgroundColor: 'rgba(74, 222, 128, 0.5)' },
};

const ALL_TEXT_COLORS = Object.keys(colorStyleMap).filter((s) =>
  s.startsWith('TEXT_')
);
const ALL_BG_COLORS = Object.keys(colorStyleMap).filter((s) =>
  s.startsWith('BG_')
);

const getBlockStyle = (block) => {
  switch (block.getType()) {
    case 'header-one':
      return 'editor-h1';
    case 'header-two':
      return 'editor-h2';
    case 'blockquote':
      return 'editor-blockquote';
    default:
      return 'editor-paragraph';
  }
};

const TextBlock = ({
  blockId,
  initialData,
  onChange,
  onReplace,
  onAddBlock,
  onRemoveBlock,
  shouldFocus,
}) => {
  const [editorState, setEditorState] = useState(() => {
    if (initialData && initialData.contentState) {
      try {
        const rawContent = JSON.parse(initialData.contentState);
        const contentState = convertFromRaw(rawContent);
        return EditorState.createWithContent(contentState);
      } catch (e) {
        return EditorState.createEmpty();
      }
    }
    return EditorState.createEmpty();
  });

  const [toolbarPosition, setToolbarPosition] = useState(null);
  
  // State Slash Menu: chứa vị trí và từ khóa tìm kiếm
  const [slashMenuData, setSlashMenuData] = useState({ 
    position: null, 
    query: '' 
  });

  const editorContainerRef = useRef(null);
  const toolbarRef = useRef(null);
  const editorRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // --- HÀM XỬ LÝ EDITOR CHANGE (QUAN TRỌNG: Thêm tham số showToolbar) ---
  const handleEditorChange = (newState, showToolbar = true) => {
    setEditorState(newState);

    const selection = newState.getSelection();
    
    // Cập nhật focus
    if (selection.getHasFocus()) setIsFocused(true);

    // 1. Logic Slash Menu
    const content = newState.getCurrentContent();
    const currentBlock = content.getBlockForKey(selection.getStartKey());
    const blockText = currentBlock.getText();
    const startOffset = selection.getStartOffset();
    
    if (blockText.startsWith('/') && selection.isCollapsed()) {
      const domSelection = window.getSelection();
      
      if (domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Lấy text sau dấu '/' để làm query lọc lệnh
        const query = blockText.substring(1);

        setSlashMenuData({
          position: {
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
          },
          query: query
        });
      }
    } else {
      setSlashMenuData(prev => ({ ...prev, position: null }));
    }

    // 2. Logic Toolbar (Bold/Italic...)
    // FIX: Chỉ hiện Toolbar nếu showToolbar = true
    if (!selection.isCollapsed() && showToolbar) {
      setTimeout(() => {
        const position = calculateToolbarPosition();
        if (position) setToolbarPosition(position);
      }, 0);
    } else {
      // Nếu collapsed HOẶC showToolbar = false -> Ẩn Toolbar
      setToolbarPosition(null);
    }

    // 3. Auto-save
    const contentState = newState.getCurrentContent();
    const oldContentState = editorState.getCurrentContent();
    if (contentState !== oldContentState) {
      const rawContent = convertToRaw(contentState);
      const dataToSave = { contentState: JSON.stringify(rawContent) };
      onChange(blockId, dataToSave);
    }
  };

  const calculateToolbarPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !editorContainerRef.current) return null;
    const range = selection.getRangeAt(0);
    const rangeRect = range.getBoundingClientRect();
    const containerRect = editorContainerRef.current.getBoundingClientRect();

    if (rangeRect.width === 0 && rangeRect.height === 0) return null;

    const toolbarWidth = toolbarRef.current ? toolbarRef.current.offsetWidth : 300;
    let left = rangeRect.left - containerRect.left + rangeRect.width / 2 - toolbarWidth / 2;
    let top = rangeRect.top - containerRect.top - 50;
    if (left < 0) left = 0;
    return { top, left, opacity: 1 };
  };

  // --- CÁC HÀM TOGGLE STYLE (FIX: Truyền false vào handleEditorChange) ---
  const toggleInlineStyle = (style) => {
    // Truyền false để ẩn toolbar ngay sau khi áp dụng
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, style), false);
  };

  const toggleBlockType = (type) => {
    handleEditorChange(RichUtils.toggleBlockType(editorState, type), false);
  };

  const toggleColorStyle = (styleToApply) => {
      const selection = editorState.getSelection();
      const currentStyle = editorState.getCurrentInlineStyle();
      const stylesToRemove = styleToApply.startsWith('TEXT_') ? ALL_TEXT_COLORS : ALL_BG_COLORS;
      let contentState = editorState.getCurrentContent();
      const newContentState = stylesToRemove.reduce((content, style) => {
        if (currentStyle.has(style)) return Modifier.removeInlineStyle(content, selection, style);
        return content;
      }, contentState);
      let finalContentState = newContentState;
      if (!styleToApply.endsWith('_DEFAULT')) {
        finalContentState = Modifier.applyInlineStyle(newContentState, selection, styleToApply);
      }
      // Truyền false để ẩn toolbar
      handleEditorChange(EditorState.push(editorState, finalContentState, 'change-inline-style'), false);
  };

  // --- XỬ LÝ LỆNH TỪ SLASH MENU ---
  const onSlashCommand = (command) => {
    setSlashMenuData({ position: null, query: '' });

    const selection = editorState.getSelection();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    
    const rangeToRemove = selection.merge({
      anchorOffset: 0,
      focusOffset: currentBlock.getLength(),
    });

    let newContentState = Modifier.removeRange(currentContent, rangeToRemove, 'backward');
    let newEditorState = EditorState.push(editorState, newContentState, 'remove-range');

    if (command.type === 'block') {
      newEditorState = RichUtils.toggleBlockType(newEditorState, command.id);
      handleEditorChange(EditorState.forceSelection(newEditorState, newContentState.getSelectionAfter()));
    } else if (command.type === 'convert' || command.type === 'insert') {
      onReplace(blockId, command.target, { text: '' });
    }
  };

  const onFocus = () => setIsFocused(true);
  const onBlur = () => {
     // Lưu ý: Không ẩn toolbar ngay lập tức ở đây vì sẽ chặn click event vào nút toolbar
     // Nhưng SlashMenu thì nên ẩn
     setSlashMenuData(prev => ({ ...prev, position: null }));
  };
  
  // Close Slash menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setSlashMenuData({ position: null, query: '' });
    if (slashMenuData.position) {
      window.addEventListener('click', handleClickOutside);
    }
    return () => window.removeEventListener('click', handleClickOutside);
  }, [slashMenuData.position]);

  // Auto Focus
  useEffect(() => {
    if (shouldFocus && editorRef.current) {
      setTimeout(() => {
        editorRef.current.focus();
        setEditorState(EditorState.moveFocusToEnd(editorState));
      }, 0);
    }
  }, [shouldFocus]);

  // Key Bindings
  const myKeyBindingFn = (e) => {
    if (slashMenuData.position) {
        if (e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            return undefined; 
        }
        if (e.key === 'Escape') {
            setSlashMenuData({ position: null, query: '' });
            return 'handled';
        }
    }

    if (e.key === 'Enter' && !e.shiftKey) return 'split-block';
    if (e.key === 'Backspace') {
      const content = editorState.getCurrentContent();
      if (!content.hasText()) return 'remove-block';
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, state) => {
    if (command === 'split-block') {
      onAddBlock(blockId);
      return 'handled';
    }
    if (command === 'remove-block') {
      onRemoveBlock(blockId);
      return 'handled';
    }
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const currentBlockType = editorState.getCurrentContent()
    .getBlockForKey(editorState.getSelection().getStartKey()).getType();
  
  const showPlaceholder = isFocused && !editorState.getCurrentContent().hasText() && 
    editorState.getCurrentContent().getBlockMap().first().getType() === 'unstyled';

  return (
    <div className="relative w-full group flex items-start -ml-6 pl-6" ref={editorContainerRef}>
      <div className="drag-handle absolute left-0 mt-1.5 p-0.5 rounded hover:bg-neutral-800 cursor-grab opacity-0 group-hover:opacity-100 text-gray-500 transition-opacity">
        <GripVertical className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0 relative">
        <FloatingToolbar
          ref={toolbarRef}
          position={toolbarPosition}
          editorState={editorState}
          onToggleInlineStyle={toggleInlineStyle}
          onToggleBlockType={toggleBlockType}
          onToggleColor={toggleColorStyle}
          currentBlockType={currentBlockType}
        />

        {slashMenuData.position && (
          <SlashMenu
            position={slashMenuData.position}
            query={slashMenuData.query}
            onSelect={onSlashCommand}
            onClose={() => setSlashMenuData({ position: null, query: '' })}
          />
        )}

        <div className="prose prose-invert max-w-none prose-strong:text-gray-100 prose-em:text-gray-100 prose-code:bg-neutral-700 prose-code:text-red-300 prose-u:decoration-gray-400">
          {showPlaceholder && (
            <div className="absolute top-0 left-0 text-gray-500 pointer-events-none select-none truncate">
               Type '/' for commands
            </div>
          )}
          <Editor
            ref={editorRef}
            editorState={editorState}
            onChange={(newState) => handleEditorChange(newState, true)} // Mặc định gõ phím thì show toolbar
            handleKeyCommand={handleKeyCommand}
            keyBindingFn={myKeyBindingFn}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder=""
            blockStyleFn={getBlockStyle}
            customStyleMap={colorStyleMap}
          />
        </div>
      </div>
    </div>
  );
};

export default TextBlock;
// client/src/components/Editor.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import api from '../services/api';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

export default function Editor({ pageId, onSave }) {
  const [page, setPage] = useState(null);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashPos, setSlashPos] = useState({ x: 0, y: 0 });
  const timer = useRef(null);
  const quillRefs = useRef([]);

  // 🧠 Load dữ liệu trang khi pageId thay đổi
  useEffect(() => {
    if (!pageId) return;
    api
      .get(`/pages/${pageId}`)
      .then((r) => setPage(r.data))
      .catch(() => {});
  }, [pageId]);

  // 💾 Hàm lưu (được ổn định bằng useCallback để không cảnh báo)
  const save = useCallback(async () => {
    if (!page) return;
    const payload = {
      title: page.title,
      parent: page.parent,
      blocks: (page.blocks || []).map((b) => ({
        type: b.type,
        content: b.content,
        checked: b.checked,
        order: b.order,
      })),
    };
    try {
      await api.put(`/pages/${pageId}`, payload);
      onSave && onSave();
      console.log('✅ Saved');
    } catch (err) {
      console.error('❌ Save failed:', err);
    }
  }, [page, pageId, onSave]);

  // 💡 Auto-save sau 2s mỗi khi page thay đổi
  useEffect(() => {
    if (!page) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => save(), 2000);
    return () => clearTimeout(timer.current);
  }, [page, save]);

  // 💾 Thêm phím tắt Ctrl + S để lưu thủ công
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [save]);

  // ➕ Thêm block mới
  const addBlock = (type = 'paragraph') => {
    const newBlock = {
      id: uuidv4(),
      type,
      content: type === 'checklist' ? '' : '<p></p>',
      checked: false,
      order: Date.now(),
    };
    setPage((p) => ({ ...p, blocks: [...(p.blocks || []), newBlock] }));
  };

  // ⌨️ Slash command ('/')
  const handleKey = (e) => {
    if (e.key === '/') {
      const rect = e.target.getBoundingClientRect();
      setSlashPos({ x: rect.left, y: rect.bottom });
      setShowSlashMenu(true);
    }
  };

  const handleSelectCommand = (cmd) => {
    setShowSlashMenu(false);
    addBlock(cmd);
  };

  if (!page) return <div>Loading...</div>;

  // ===============================
  // 🧩 Giao diện chính của Editor
  // ===============================
  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
      {/* Tiêu đề trang */}
      <input
        value={page.title}
        onChange={(e) => setPage({ ...page, title: e.target.value })}
        placeholder="Page title..."
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          border: 'none',
          outline: 'none',
          width: '100%',
          marginBottom: '1rem',
        }}
      />

      {/* Các block nội dung */}
      {page?.blocks?.map((b, index) => (
        <div key={b.id} style={{ margin: '8px 0' }}>
          {b.type === 'checklist' ? (
            <div>
              <input
                type="checkbox"
                checked={b.checked}
                onChange={() => {
                  const nb = [...page.blocks];
                  nb[index].checked = !nb[index].checked;
                  setPage({ ...page, blocks: nb });
                }}
              />
              <input
                value={b.content}
                onChange={(e) => {
                  const nb = [...page.blocks];
                  nb[index].content = e.target.value;
                  setPage({ ...page, blocks: nb });
                }}
                onKeyDown={handleKey}
                placeholder="Checklist item..."
              />
            </div>
          ) : (
            <ReactQuill
              ref={(el) => (quillRefs.current[index] = el)}
              value={b.content}
              onChange={(val) => {
                const nb = [...page.blocks];
                nb[index].content = val;
                setPage({ ...page, blocks: nb });
              }}
              onKeyDown={handleKey}
              theme="snow"
            />
          )}
        </div>
      ))}

      {/* Slash menu */}
      {showSlashMenu && (
        <div
          style={{
            position: 'absolute',
            top: slashPos.y + 5,
            left: slashPos.x,
            background: '#fff',
            border: '1px solid #ccc',
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
            zIndex: 100,
          }}
        >
          <div onClick={() => handleSelectCommand('heading')}>📘 Heading</div>
          <div onClick={() => handleSelectCommand('paragraph')}>📝 Paragraph</div>
          <div onClick={() => handleSelectCommand('checklist')}>✅ Checklist</div>
        </div>
      )}

      {/* Nút thêm block */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => addBlock('paragraph')}>+ Paragraph</button>
        <button onClick={() => addBlock('heading')}>+ Heading</button>
        <button onClick={() => addBlock('checklist')}>+ Checklist</button>
      </div>
    </div>
  );
}

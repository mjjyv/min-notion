// client/src/pages/PageView.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import RichTextEditor from "../components/RichTextEditor";

// Debounce helper
function useDebounce(callback, delay) {
  const timer = useRef(null);
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => cbRef.current(...args), delay);
    },
    [delay]
  );
}

const PageView = ({ id: propId, onDelete }) => {
  const params = useParams();
  const navigate = useNavigate();
  const pageId = propId || params.id; // linh hoạt: từ prop hoặc URL

  const [page, setPage] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // ========== FETCH PAGE ==========
  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pages/${pageId}`);
        setPage(res.data);
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      } catch (err) {
        console.error("Lỗi tải trang:", err);
        alert("Không tải được trang");
      } finally {
        setLoading(false);
      }
    };
    if (pageId) fetchPage();
  }, [pageId]);

  // ========== SAVE LOGIC ==========
  const save = async (payload = { title, content }) => {
    try {
      setSaving(true);
      await api.put(`/pages/${pageId}`, payload);
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useDebounce(save, 1000);

  // ========== HANDLERS ==========
  const onTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave({ title: newTitle, content });
  };

  const onContentChange = (val) => {
    setContent(val);
    debouncedSave({ title, content: val });
  };

  const manualSave = async () => save({ title, content });

  const handleDelete = async () => {
    if (!window.confirm("Xác nhận xóa trang này (và các trang con nếu có)?")) return;
    try {
      if (onDelete) {
        // Nếu được gọi từ Dashboard
        await onDelete(pageId);
      } else {
        // Nếu mở trực tiếp qua URL
        await api.delete(`/pages/${pageId}`);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Lỗi xóa:", err);
      alert("Xóa thất bại");
    }
  };

  // ========== RENDER ==========
  if (loading) return <div className="p-3 text-muted">Đang tải...</div>;
  if (!page) return <div className="p-3 text-danger">Không tìm thấy trang</div>;

  return (
    <div className="page-view p-3">
      {/* Tiêu đề */}
      <input
        className="form-control mb-3 fw-semibold fs-5 border-0 border-bottom rounded-0 shadow-none"
        value={title}
        onChange={onTitleChange}
        placeholder="Tiêu đề trang..."
      />

      {/* Editor */}
      <div className="mb-3">
        <RichTextEditor value={content} onChange={onContentChange} />
      </div>

      {/* Nút hành động */}
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-success btn-save"
          onClick={manualSave}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu"}
        </button>

        <button className="btn btn-outline-danger" onClick={handleDelete}>
          Xóa
        </button>

        <span className="ms-auto text-muted small">
          {saving ? "Đang lưu..." : "Đã lưu"}
        </span>
      </div>
    </div>
  );
};

export default PageView;

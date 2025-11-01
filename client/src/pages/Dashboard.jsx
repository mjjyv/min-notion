// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import PageView from "./PageView";
import api from "../services/api";
import { Spinner } from "react-bootstrap";

export default function Dashboard() {
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  // === FETCH PAGES TREE ===
  const fetchPages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/pages/tree", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPages(res.data);
    } catch (err) {
      console.error("Lỗi tải danh sách trang:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  // === CRUD HANDLERS ===
  const handleCreatePage = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/pages",
        { title: "Trang mới" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPages();
      setSelected(res.data.page); // Server trả { page }
    } catch (err) {
      console.error("Lỗi tạo trang:", err);
      alert("Tạo trang thất bại. Kiểm tra console server.");
    }
  };

  const handleCreateChildPage = async (parentId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post(
        "/pages",
        { parentId, title: "Trang con mới" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPages();
      setSelected(res.data.page);
    } catch (err) {
      console.error("Lỗi tạo trang con:", err);
      alert("Tạo trang con thất bại. Kiểm tra console server.");
    }
  };

  const handleSelectPage = (page) => {
    setSelected(page);
  };

  const handleDeletePage = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa trang này (và các trang con)?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/pages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelected(null);
      fetchPages();
    } catch (err) {
      console.error("Lỗi xóa trang:", err);
      alert("Xóa thất bại");
    }
  };

  // === RENDER ===
  return (
    <div className="app-container d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar
        pages={pages}
        onSelect={handleSelectPage}
        onCreate={handleCreatePage}
        onCreateChild={handleCreateChildPage}
      />

      {/* Main content */}
      <main className="app-content flex-grow-1 bg-white p-3 border-start">
        {loading ? (
          <div className="text-center py-5 text-muted">
            <Spinner animation="border" size="sm" /> Đang tải trang...
          </div>
        ) : selected ? (
          <PageView
            key={selected._id}
            id={selected._id}
            onDelete={handleDeletePage}
          />
        ) : (
          <div className="p-4 text-muted text-center">
            <h5>Chào mừng bạn đến Notion Mini ✨</h5>
            <p>Hãy chọn hoặc tạo một trang mới để bắt đầu ghi chú.</p>
            <button className="btn btn-primary" onClick={handleCreatePage}>
              + Tạo trang mới
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

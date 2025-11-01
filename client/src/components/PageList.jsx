// client/src/components/PageList.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const PageList = () => {
  const [pages, setPages] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/pages");
      setPages(res.data || []);
    } catch (err) {
      console.error("fetch pages error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPages(); }, []);

  const createPage = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await api.post("/pages", { title: newTitle.trim() });
      setPages((p) => [...p, res.data]);
      setNewTitle("");
      navigate(`/pages/${res.data._id}`);
    } catch (err) {
      console.error("create page error", err);
      alert("Tạo trang thất bại");
    }
  };

  return (
    <div className="page-list">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Trang của tôi</h5>
        <button className="btn btn-sm btn-outline-secondary" onClick={fetchPages}>
          Refresh
        </button>
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <ul className="list-group mb-3">
          {pages.map((pg) => (
            <li
              key={pg._id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              onClick={() => navigate(`/pages/${pg._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div>
                <div className="fw-semibold">{pg.title}</div>
                <small className="text-muted">{new Date(pg.updatedAt || pg.createdAt).toLocaleString()}</small>
              </div>
              <div className="text-muted small">›</div>
            </li>
          ))}
          {pages.length === 0 && <li className="list-group-item">Không có trang nào</li>}
        </ul>
      )}

      <div className="d-flex gap-2">
        <input
          className="form-control"
          placeholder="Tiêu đề trang mới"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className="btn btn-primary" onClick={createPage}>Tạo</button>
      </div>
    </div>
  );
};

export default PageList;

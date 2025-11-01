// client/src/components/Header.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    // nếu backend có endpoint logout bạn có thể gọi ở đây
    navigate("/login");
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand fw-bold" href="/dashboard">
          Mini-Notion
        </a>

        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm me-2"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={logout}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

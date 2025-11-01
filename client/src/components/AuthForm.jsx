// client/src/components/AuthForm.jsx
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ type }) => {
  const navigate = useNavigate();
  const isLogin = type === "login";

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(url, formData);
      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        // assume register returns success message
        navigate("/login", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form shadow-sm">
      <h4 className="mb-3">{isLogin ? "Đăng nhập" : "Đăng ký"}</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label visually-hidden">Email</label>
          <input
            className="form-control"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-3">
          <label className="form-label visually-hidden">Mật khẩu</label>
          <input
            className="form-control"
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="d-flex justify-content-between align-items-center">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Đang..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
          <a href={isLogin ? "/register" : "/login"} className="small">
            {isLogin ? "Tạo tài khoản mới" : "Đã có tài khoản?"}
          </a>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;

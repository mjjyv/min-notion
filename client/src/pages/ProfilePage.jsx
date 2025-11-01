import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ProfilePage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/auth/me", user);
      alert("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Thông tin tài khoản</h4>
      <div className="mb-3">
        <label className="form-label">Tên</label>
        <input
          className="form-control"
          name="name"
          value={user.name}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          className="form-control"
          name="email"
          value={user.email}
          disabled
        />
      </div>
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>
    </div>
  );
}

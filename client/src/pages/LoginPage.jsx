// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Đăng nhập Mini-Notion</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu" required />
        <button type="submit" style={{ marginTop: '10px' }}>Đăng nhập</button>
      </form>
      <p>Chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
    </div>
  );
}

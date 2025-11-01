// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', width: '250px' }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Tên hiển thị" required />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu" required />
        <button type="submit" style={{ marginTop: '10px' }}>Đăng ký</button>
      </form>
      <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
    </div>
  );
}

// client/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import PageView from "./pages/PageView";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  const { user } = useAuth();

  // Nếu chưa đăng nhập -> chỉ hiển thị trang login/register
  if (!user) {
    return (
      <div className="bg-light d-flex justify-content-center align-items-center vh-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    );
  }

  // Khi đã đăng nhập -> giao diện chính có Header, Sidebar, Content
  return (
    <>
      <Header />
      <div className="app-container d-flex">
        <Sidebar />
        <main className="app-content flex-grow-1">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pages/:id" element={<PageView />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WorkspacePage from './pages/WorkspacePage'; // Import trang mới
import ProtectedRoute from './routes/ProtectedRoute'; // Import component bảo vệ
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Route 1: Trang Workspace (chính)
        - Bọc trong ProtectedRoute
        - Đây sẽ là trang mặc định "/"
      */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <WorkspacePage />
          </ProtectedRoute>
        }
      />

      {/* Route 2: Trang Login
        - Nếu đã đăng nhập, tự động điều hướng về "/"
      */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
      />

      {/* Route 3: Trang Register
        - Nếu đã đăng nhập, tự động điều hướng về "/"
      */}
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
      />

      {/* Route 4: Bất kỳ đường dẫn nào khác không khớp */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
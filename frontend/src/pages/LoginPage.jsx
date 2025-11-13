import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout
      title="Chào mừng trở lại"
      description="Đăng nhập vào tài khoản Mini-Notion của bạn."
    >
      <LoginForm />
      <p className="mt-8 text-center text-sm text-gray-300">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="font-medium text-brand hover:text-brand-medium"
        >
          Đăng ký ngay
        </Link>
      </p>
    </AuthLayout>
  );
};
export default LoginPage;
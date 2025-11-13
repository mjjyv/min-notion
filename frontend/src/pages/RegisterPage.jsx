import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import RegisterForm from '../features/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout
      title="Tạo tài khoản mới"
      description="Bắt đầu hành trình ghi chú của bạn ngay hôm nay."
    >
      <RegisterForm />
      <p className="mt-8 text-center text-sm text-gray-300">
        Đã có tài khoản?{' '}
        <Link
          to="/login"
          className="font-medium text-brand hover:text-brand-medium"
        >
          Đăng nhập
        </Link>
      </p>
    </AuthLayout>
  );
};
export default RegisterPage;
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { register as apiRegister } from '../../api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useNavigate } from 'react-router-dom';

// 1. Schema Validation (có so sánh mật khẩu)
const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp.',
    path: ['confirmPassword'], // Gán lỗi cho trường confirmPassword
  });

const RegisterForm = () => {
  const navigate = useNavigate();
  // State cho thông báo thành công
  const [successMessage, setSuccessMessage] = useState('');

  // 2. Khởi tạo react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // 3. Xử lý Submit
  const onSubmit = async (data) => {
    setSuccessMessage('');
    try {
      const { name, email, password } = data;
      await apiRegister(name, email, password);
      
      // Đăng ký thành công
      setSuccessMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // 4. Xử lý lỗi (ví dụ: email tồn tại)
      const message = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setError('root', { message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 5. Hiển thị Lỗi hoặc Thành công */}
      {errors.root && (
        <div className="text-red-500 text-sm">{errors.root.message}</div>
      )}
      {successMessage && (
        <div className="text-green-600 text-sm">{successMessage}</div>
      )}
      
      {/* Trường Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Tên</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          hasError={!!errors.name}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Trường Email */}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          hasError={!!errors.email}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Trường Password */}
      <div className="space-y-1">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          hasError={!!errors.password}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Trường Confirm Password */}
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          hasError={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          isLoading={isSubmitting || !!successMessage} // Vô hiệu hóa khi loading hoặc thành công
        >
          Tạo tài khoản
        </Button>
      </div>
    </form>
  );
};
export default RegisterForm;
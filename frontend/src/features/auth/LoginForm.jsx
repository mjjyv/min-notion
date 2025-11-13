import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Github, Mail } from 'lucide-react'; // Icons

// 1. Định nghĩa Schema Validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }),
});

const LoginForm = () => {
  const { dispatch } = useAuth();
  
  // 2. Khởi tạo react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }, // Lấy trạng thái loading và lỗi
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // 3. Xử lý Submit
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const apiResponse = await login(email, password); // { user, token }
      
      // Cập nhật Context
      dispatch({ type: 'LOGIN_SUCCESS', payload: apiResponse });
      // (Không cần điều hướng, App.jsx sẽ tự động xử lý)

    } catch (err) {
      // 4. Xử lý lỗi từ server
      const message = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setError('root', { message }); // Gán lỗi chung cho form
    }
  };

  return (
    <>
      {/* 5. Form UI */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Hiển thị lỗi chung (từ server) */}
        {errors.root && (
          <div className="text-red-500 text-sm">{errors.root.message}</div>
        )}
        
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
            autoComplete="current-password"
            hasError={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Nút Submit (có trạng thái loading) */}
        <div>
          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Đăng nhập
          </Button>
        </div>
      </form>

      {/* 6. Phần OAuth (Đăng nhập khác) */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            {/* <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span> */}
            <div class="relative flex items-center">
              <div class="grow bg-amber-50 border-t border-gray-300"></div> 
              
              <span class="shrink mx-4 bg-amber-50 p-1 rounded-sm text-sm text-gray-500 font-medium">
                HOẶC TIẾP TỤC VỚI
              </span>
              
              <div class="grow border-t border-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {/* Nút OAuth (chưa có chức năng) */}
          <Button variant="outline" disabled={isSubmitting}>
            <Github className="mr-2 h-4 w-4" /> GitHub
          </Button>
          <Button variant="outline" disabled={isSubmitting}>
            <Mail className="mr-2 h-4 w-4" /> Google
          </Button>
        </div>
      </div>
    </>
  );
};
export default LoginForm;
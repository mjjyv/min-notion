import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { register as apiRegister } from '../../api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import FormError from '../../components/ui/FormError'; // <-- Mới
import { AlertTriangle } from 'lucide-react'; // <-- Mới
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- Mới

const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }),
    email: z.string().email({ message: 'Email không hợp lệ.' }),
    password: z.string().min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp.',
    path: ['confirmPassword'],
  });

// Cấu hình hiệu ứng
const formVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const RegisterForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setSuccessMessage('');
    try {
      const { name, email, password } = data;
      await apiRegister(name, email, password);
      setSuccessMessage('Đăng ký thành công! Đang chuyển đến trang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const message = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setError('root', { message });
    }
  };

  return (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* CẢI TIẾN: Sử dụng FormError và Success Message */}
      <FormError message={errors.root?.message} />
      {successMessage && (
        <div className="text-green-400 text-sm p-3 bg-green-900/20 border border-green-500/50 rounded-md">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div variants={itemVariants} className="space-y-1">
          <Label htmlFor="name" className="text-gray-300">Tên</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            hasError={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="flex items-center text-red-400 text-sm mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.name.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1">
          <Label htmlFor="email" className="text-gray-300">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            hasError={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="flex items-center text-red-400 text-sm mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.email.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1">
          <Label htmlFor="password" className="text-gray-300">Mật khẩu</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            hasError={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="flex items-center text-red-400 text-sm mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.password.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-1">
          <Label htmlFor="confirmPassword" className="text-gray-300">Xác nhận mật khẩu</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            hasError={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="flex items-center text-red-400 text-sm mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {errors.confirmPassword.message}
            </p>
          )}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            isLoading={isSubmitting || !!successMessage}
          >
            Tạo tài khoản
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
export default RegisterForm;
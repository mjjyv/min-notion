import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import FormError from '../../components/ui/FormError'; // <-- Mới
import { Github, Mail, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion'; // <-- Mới

const loginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }),
});

// Cấu hình hiệu ứng
const formVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1, // Hiệu ứng cho từng phần tử con
    },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const LoginForm = () => {
  const { dispatch } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { email, password } = data;
      const apiResponse = await login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: apiResponse });
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
      {/* CẢI TIẾN: Hiển thị Đăng nhập xã hội trước */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="text-gray-100 hover:text-black" disabled={isSubmitting}>
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Button>
        <Button variant="outline" className="text-gray-100 hover:text-black" disabled={isSubmitting}>
          <Mail className="mr-2 h-4 w-4" /> Google
        </Button>
      </motion.div>

      {/* Dải phân cách */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-brand-light px-2 text-gray-400">
            Hoặc đăng nhập với email
          </span>
        </div>
      </motion.div>

      {/* CẢI TIẾN: Sử dụng FormError */}
      <FormError message={errors.root?.message} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            autoComplete="current-password"
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

        <motion.div variants={itemVariants}>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            isLoading={isSubmitting}
          >
            Đăng nhập
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
export default LoginForm;
import React from 'react';
import { motion } from 'framer-motion';
import { NotebookText } from 'lucide-react';

const AuthLayout = ({ children, title, description }) => {
  return (
    <div className="flex min-h-screen w-screen bg-brand-light">
      {/* 1. Phần bên trái (Nội dung) - Giữ nguyên */}
      <motion.div
        className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center text-brand-dark">
              <NotebookText className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold">Mini-Notion</span>
            </div>
            {/* * Tương phản TỐT:
              * text-gray-900 (gần đen) trên bg-brand-light (rất nhạt)
              * text-gray-600 (xám đậm) trên bg-brand-light (rất nhạt)
            */}
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-500">
              {title}
            </h2>
            <p className="mt-2 text-sm text-gray-300">{description}</p>
          </div>
          <div className="mt-8">{children}</div>
        </div>
      </motion.div>

      {/* 2. Phần bên phải (Trang trí) - NÂNG CẤP */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <motion.div
          className="absolute inset-0 h-full w-full 
                     bg-linear-to-br from-brand-medium to-brand-dark" // <-- Thêm gradient
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div className="flex h-full items-center justify-center">
            {/*
              * SỬA LỖI TƯƠNG PHẢN:
              * text-brand-light (màu sáng) trên nền gradient (màu tối)
              * Trước đây: text-brand-dark (tối) trên bg-brand-medium (tối)
            */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.5,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <NotebookText className="h-64 w-64 text-brand-light opacity-20" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
export default AuthLayout;
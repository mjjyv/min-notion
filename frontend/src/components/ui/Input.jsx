import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(
  ({ className, type, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm',
          'ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200 ease-in-out', // <-- Thêm hiệu ứng
          
          // Logic tương phản và trạng thái lỗi
          hasError
            ? 'border-red-500 text-red-900 focus-visible:ring-red-500' // <-- Lỗi (tương phản tốt)
            : 'border-gray-300 text-gray-900 focus-visible:ring-brand-dark', // <-- Mặc định (tương phản tốt)
            
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
export { Input };
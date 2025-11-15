import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(
  ({ className, type, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border bg-neutral-900 px-3 py-2 text-sm',
          'text-gray-100 placeholder:text-gray-500',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors duration-200 ease-in-out',

          // CẢI TIẾN: Thay đổi màu dựa trên trạng thái
          hasError
            ? 'border-red-500 focus-visible:ring-red-500' // Lỗi
            : 'border-neutral-700 focus-visible:border-brand focus-visible:ring-brand', // Mặc định & Focus
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
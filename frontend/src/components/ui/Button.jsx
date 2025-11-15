import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react'; // Icon loading

// Định nghĩa các biến thể (variants) của Button
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-brand text-white hover:bg-brand-medium active:bg-brand-darker',
        // Thêm một variant để tùy chỉnh màu
        primary: 'bg-brand text-white hover:bg-brand-medium', // Có thể giữ nguyên
        secondary: 'bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-700',
        destructive: 'bg-red-500 text-white hover:bg-red-600',
        outline: 'border border-input bg-transparent hover:bg-gray-100',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      children,
      isLoading = false,
      ...props
    },
    ref,
  ) => {
    // Nếu đang loading, hiển thị icon
    const Comp = asChild ? 'span' : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : null}
        {children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';
export { Button, buttonVariants };
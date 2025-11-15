import React from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Component hiển thị lỗi chung (ví dụ: lỗi server) cho một form.
 */
const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 rounded-md border border-red-500/50 bg-red-900/20 p-3">
      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
};

export default FormError;
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      // Nâng cấp: Dùng nền bg-brand-light cho mượt mà
      <div className="flex items-center justify-center min-h-screen bg-brand-light">
        {/* Tương phản TỐT: icon màu (text-brand) trên nền rất nhạt */}
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
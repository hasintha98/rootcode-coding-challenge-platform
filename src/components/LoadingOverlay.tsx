import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const LoadingOverlay: React.FC = () => {
  const { isLoading } = useSelector((state: RootState) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default LoadingOverlay;
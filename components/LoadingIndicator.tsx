
import React from 'react';

interface LoadingIndicatorProps {
  message: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-xl font-semibold text-gray-300 text-center">{message}</p>
        <p className="mt-2 text-sm text-gray-500 text-center">This may take a few minutes. Please don't close this window.</p>
    </div>
  );
};

export default LoadingIndicator;

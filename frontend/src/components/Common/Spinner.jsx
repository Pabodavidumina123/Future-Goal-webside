import React from 'react';

const Spinner = ({ size = 'medium', fullScreen = false }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.medium;

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`animate-spin rounded-full border-indigo-500/20 border-t-indigo-500 ${selectedSize}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Loading opportunities...
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

export default Spinner;

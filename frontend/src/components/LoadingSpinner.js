// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-green-800 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
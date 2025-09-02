// src/components/LoadingSpinner.js

import React from 'react';

export default function LoadingSpinner({ fullScreen }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[999] flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-6 h-6 border-2 border-slate-300 border-t-sky-500 rounded-full animate-spin"></div>
  );
}

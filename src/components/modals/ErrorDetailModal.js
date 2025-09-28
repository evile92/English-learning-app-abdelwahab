// src/components/modals/ErrorDetailModal.js

import React from 'react';
import { X, AlertCircle, User, Monitor, Globe, Info, Hash, Code } from 'lucide-react';

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
    <Icon className="w-5 h-5 text-slate-400 mt-1" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-base text-slate-800 dark:text-slate-100 break-words">{value || 'N/A'}</p>
    </div>
  </div>
);

const ErrorDetailModal = ({ error, onClose }) => {
  if (!error) return null;

  const { message, context, severity, code, user, environment, errorDetails, url } = error;

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-7 h-7 text-red-500" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">تفاصيل الخطأ</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <DetailRow icon={Info} label="رسالة الخطأ" value={message} />
          <DetailRow icon={Code} label="سياق الخطأ" value={context} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <DetailRow icon={AlertCircle} label="الخطورة" value={severity} />
            <DetailRow icon={Hash} label="رمز الخطأ" value={code} />
          </div>
          <DetailRow icon={User} label="معلومات المستخدم" value={`${user?.name || 'N/A'} (ID: ${user?.id || 'N/A'})`} />
          <DetailRow icon={Monitor} label="بيئة التشغيل" value={`${environment?.userAgent}`} />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
             <DetailRow icon={Monitor} label="حجم الشاشة" value={environment?.screenSize} />
             <DetailRow icon={Globe} label="حالة الاتصال" value={environment?.isOnline ? 'متصل' : 'غير متصل'} />
           </div>
          
          {errorDetails?.stack && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">التتبع التقني (Stack Trace):</p>
              <pre className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg text-xs text-red-500 dark:text-red-400 overflow-auto max-h-40">
                <code>{errorDetails.stack}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDetailModal;

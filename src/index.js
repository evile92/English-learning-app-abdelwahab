import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
// 🔧 إضافة استيراد errorHandler
import { logError } from './utils/errorHandler';

// 🔧 إضافة Global Error Handlers
window.addEventListener('error', (event) => {
    const error = {
        message: `Global JS Error: ${event.message}`,
        code: 'GLOBAL_JS_ERROR',
        severity: 'high'
    };
    
    logError(error, `${event.filename}:${event.lineno}:${event.colno}`, {
        stack: event.error?.stack || 'غير متوفر',
        globalError: true
    }).catch(console.error);
});

window.addEventListener('unhandledrejection', (event) => {
    const error = {
        message: `Unhandled Promise: ${event.reason}`,
        code: 'UNHANDLED_PROMISE',
        severity: 'critical'
    };
    
    logError(error, 'Promise Rejection', {
        reason: String(event.reason),
        unhandledPromise: true
    }).catch(console.error);
});

window.addEventListener('offline', () => {
    const error = {
        message: 'Lost internet connection',
        code: 'NETWORK_OFFLINE',
        severity: 'medium'
    };
    
    logError(error, 'Network Status', {
        connectionType: navigator.connection?.effectiveType || 'unknown',
        offline: true
    }).catch(console.error);
});

// 1. إنشاء "الجذر" (root) للتطبيق بالطريقة الحديثة
const root = ReactDOM.createRoot(document.getElementById('root'));

// 2. تصيير التطبيق داخل الجذر
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

// 3. تسجيل الـ Service Worker (مهم لتطبيقات الويب التقدمية)
// يفضل استخدام register بدلاً من unregister للاستفادة من الميزات
serviceWorkerRegistration.register();

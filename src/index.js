import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { logError } from './utils/errorHandler';

// معالجة الأخطاء العامة مع fallback آمن
function safeLogError(error, context, details) {
    logError(error, context, details).catch(() => {
        // fallback بسيط دون تعقيد
        console.error(`${error.code || 'ERROR'}:`, error.message);
    });
}

// معالج الأخطاء العامة
window.addEventListener('error', (event) => {
    safeLogError({
        message: `Global JS Error: ${event.message}`,
        code: 'GLOBAL_JS_ERROR',
        severity: 'high'
    }, `${event.filename}:${event.lineno}:${event.colno}`, {
        stack: event.error?.stack || 'غير متوفر',
        globalError: true
    });
});

// معالج Promise Rejections مع منع الانتشار
window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault(); // هذا هو الحل الأساسي للمشكلة
    
    safeLogError({
        message: `Unhandled Promise: ${event.reason}`,
        code: 'UNHANDLED_PROMISE',
        severity: 'critical'
    }, 'Promise Rejection', {
        reason: String(event.reason),
        unhandledPromise: true
    });
});

// معالج الشبكة
window.addEventListener('offline', () => {
    safeLogError({
        message: 'Lost internet connection',
        code: 'NETWORK_OFFLINE',
        severity: 'medium'
    }, 'Network Status', {
        connectionType: navigator.connection?.effectiveType || 'unknown',
        offline: true
    });
});

// إنشاء التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

// تسجيل Service Worker مع تأخير بسيط للأجهزة المحمولة
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    setTimeout(() => {
        serviceWorkerRegistration.register();
    }, 1500);
} else {
    serviceWorkerRegistration.register();
}

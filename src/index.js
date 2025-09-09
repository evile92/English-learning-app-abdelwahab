import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

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

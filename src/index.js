// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// هذا هو الملف الرئيسي الذي يبدأ تشغيل التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));

// ✨ === هنا تم الإصلاح الجذري === ✨
// نقوم بوضع AppProvider هنا ليقوم بتحميل كل شيء قبل عرض التطبيق
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();

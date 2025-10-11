import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/AppContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { logError } from './utils/errorHandler';
import { BrowserRouter } from 'react-router-dom';

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
    // تجاهل أخطاء تحديث الـ Service Worker لأننا سنتعامل معها بذكاء
    if (event.reason && typeof event.reason.message === 'string' && event.reason.message.includes('ServiceWorker')) {
        console.warn('Suppressed a non-critical Service Worker update error.');
        event.preventDefault();
        return;
    }
    
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

// ضمان تحميل CSS قبل React
const ensureCSSLoaded = () => {
    return new Promise((resolve) => {
        const checkCSS = () => {
            const mainCSS = document.querySelector('link[href*="/static/css/main"]');
            if (mainCSS && mainCSS.sheet) {
                try {
                    const rules = mainCSS.sheet.cssRules || mainCSS.sheet.rules;
                    if (rules && rules.length > 0) {
                        resolve();
                        return;
                    }
                } catch (e) {
                    // CSS لم يحمل بعد
                }
            }
            setTimeout(checkCSS, 50);
        };
        checkCSS();
        
        // Fallback timeout
        setTimeout(resolve, 2000);
    });
};

// إنشاء التطبيق
const root = ReactDOM.createRoot(document.getElementById('root'));

// إنشاء التطبيق مع ضمان تحميل CSS
ensureCSSLoaded().then(() => {
    root.render(
        <React.StrictMode>
            <BrowserRouter>
                <AppProvider>
                    <App />
                </AppProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
});

// ✅ --- بداية الإصلاح النهائي الذي اقترحته أنت ---

// دالة لتأجيل تحديث الـ Service Worker عند العودة لواجهة التطبيق
function scheduleSWUpdateOnResume(registration) {
  let timer = null;

  function tryUpdate() {
    // لا تقم بالتحديث إذا كان المستخدم غير متصل بالإنترنت
    const online = navigator.onLine !== false;
    if (!online) {
      console.log("Skipping SW update check: Offline.");
      return;
    }

    console.log("Checking for Service Worker update...");
    registration.update().catch(() => {
      // تجاهل أخطاء فشل التحديث هنا لتجنب إظهارها في الكونسول
      console.warn("SW update check failed, but this is often a normal race condition on resume.");
    });
  }

  function onVisible() {
    clearTimeout(timer);
    // تأخير بسيط (3 ثوانٍ) بعد عودة المستخدم لتجنب الأخطاء الناتجة عن استئناف الاتصال
    timer = setTimeout(tryUpdate, 3000);
  }
  
  // الاستماع لحدث تغيير ظهور الصفحة
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      onVisible();
    }
  });

  // الاستماع لحدث عودة الاتصال بالإنترنت
  window.addEventListener('online', onVisible);
}

// تسجيل الـ Service Worker مع المنطق الجديد
serviceWorkerRegistration.register({
  onSuccess(registration) {
    console.log('Service Worker registered successfully.');
    scheduleSWUpdateOnResume(registration);
  },
  onUpdate(registration) {
    console.log('New Service Worker update is available.');
    // يمكنك إضافة إشعار للمستخدم هنا لتحديث الصفحة
    // وفي نفس الوقت، نجدول الفحص الدوري
    scheduleSWUpdateOnResume(registration);
  }
});
// --- 🛑 نهاية الإصلاح النهائي ---

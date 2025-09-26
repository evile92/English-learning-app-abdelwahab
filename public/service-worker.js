// public/service-worker.js

// فعّل العامل مباشرة عند التثبيت
self.addEventListener('install', (event) => {
  self.skipWaiting(); // تفعيل فوري
});

// اجعل هذا العامل نشطاً لكل الصفحات ضمن النطاق مباشرة
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// مستمع fetch شفاف (لا يقوم بالتخزين المؤقت حاليًا)
self.addEventListener('fetch', () => {
  // لا نتدخل في الطلبات حالياً
});

const CACHE_NAME = 'stellarspeak-v2.0';
const STATIC_CACHE = 'static-v2.0';
const DYNAMIC_CACHE = 'dynamic-v2.0';

// ملفات أساسية للتخزين بدون ملفات js/css ثابتة
const STATIC_ASSETS = [
  '/',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  '/favicon.ico'
];

// محتوى يمكن الوصول إليه بدون نت
const OFFLINE_CONTENT = {
  lessons: [], // سيتم ملؤها ديناميكياً
  vocabulary: [],
  userData: null
};

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الأساسية
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      
      // تحضير المحتوى للاستخدام بدون نت
      self.skipWaiting()
    ])
  );
});

// تفعيل Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // مسح الcaches القديمة
      caches.keys().then(names =>
        Promise.all(
          names.filter(name => 
            name !== STATIC_CACHE && 
            name !== DYNAMIC_CACHE
          ).map(name => caches.delete(name))
        )
      ),
      
      self.clients.claim()
    ])
  );
});

// معالجة الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تعامل مع طلبات Firebase
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // حفظ البيانات في cache إذا كانت مهمة
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // إرجاع من Cache إذا فشل الطلب
          return caches.match(request);
        })
    );
    return;
  }

  // تعامل مع الملفات الثابتة
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(cached => {
          if (cached) {
            return cached;
          }
          
          return fetch(request)
            .then(response => {
              // حفظ في cache للمرة القادمة
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then(cache => {
                  cache.put(request, responseClone);
                });
              }
              return response;
            })
            .catch(() => {
              // صفحة بدون نت
              if (request.destination === 'document') {
                return new Response(`
                  <html dir="rtl">
                    <head><title>بدون اتصال - StellarSpeak</title></head>
                    <body style="text-align:center; padding:50px; font-family:Arial;">
                      <h1>🔗 غير متصل</h1>
                      <p>لا يوجد اتصال بالإنترنت حالياً</p>
                      <p>يمكنك استعراض المحتوى المحفوظ مسبقاً</p>
                      <button onclick="location.reload()">إعادة المحاولة</button>
                    </body>
                  </html>
                `, {
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
              }
              return new Response('محتوى غير متاح بدون نت', { status: 503 });
            });
        })
    );
  }
});

// معالجة الرسائل من التطبيق
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'CACHE_LESSON':
      // حفظ درس للاستخدام بدون نت
      caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put(`/lesson/${data.id}`, new Response(JSON.stringify(data)));
      });
      break;

    case 'CACHE_USER_DATA':
      // حفظ بيانات المستخدم
      caches.open(DYNAMIC_CACHE).then(cache => {
        cache.put('/user-data', new Response(JSON.stringify(data)));
      });
      break;

    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
  }
});

// إشعارات Push (إذا كانت مدعومة)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'stellarspeak-notification',
      actions: [
        { action: 'open', title: 'فتح التطبيق' },
        { action: 'close', title: 'إغلاق' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// التعامل مع نقر الإشعارات
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

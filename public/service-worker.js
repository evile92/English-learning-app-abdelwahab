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

// إضافة معالج للـ unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Promise Rejection:', event.reason);
  // منع الخطأ من الظهور في الكونسول
  event.preventDefault();
});

// إضافة معالج للأخطاء العامة
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
});

// تثبيت Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // تخزين الملفات الأساسية
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)).catch(error => {
        console.error('Error caching static assets:', error);
        // إرجاع promise فارغ لتجنب فشل التثبيت
        return Promise.resolve();
      }),
      
      // تحضير المحتوى للاستخدام بدون نت
      self.skipWaiting()
    ]).catch(error => {
      console.error('Service Worker install error:', error);
      return Promise.resolve();
    })
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
      ).catch(error => {
        console.error('Error cleaning old caches:', error);
        return Promise.resolve();
      }),
      
      self.clients.claim()
    ]).catch(error => {
      console.error('Service Worker activate error:', error);
      return Promise.resolve();
    })
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
            }).catch(error => {
              console.error('Error caching Firebase response:', error);
            });
          }
          return response;
        })
        .catch(error => {
          console.error('Firebase request failed:', error);
          // إرجاع من Cache إذا فشل الطلب
          return caches.match(request).catch(() => {
            return new Response('خدمة غير متاحة', { status: 503 });
          });
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
                }).catch(error => {
                  console.error('Error caching response:', error);
                });
              }
              return response;
            })
            .catch(error => {
              console.error('Fetch request failed:', error);
              // *** التعديل هنا بالضبط ***
              // عند فقد الاتصال ويتم طلب صفحة (document أو navigate)، حاول إرجاع الصفحة الرئيسية من الكاش أو صفحة Offline
              if (request.destination === 'document' || request.mode === 'navigate') {
                return caches.match('/')
                  .then(response => response || caches.match('/index.html'))
                  .then(response => response || new Response(`
                  <html dir="rtl">
                    <head><title>بدون اتصال - StellarSpeak</title></head>
                    <body style="text-align:center; padding:50px; font-family:Arial;">
                      <h1>🔗 غير متصل</h1>
                      <p>لا يوجد اتصال بالإنترنت حالياً</p>
                      <button onclick="location.reload()">إعادة المحاولة</button>
                    </body>
                  </html>
                `, {
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                }))
                  .catch(() => {
                    return new Response('صفحة غير متاحة بدون نت', { status: 503 });
                  });
              }
              return new Response('محتوى غير متاح بدون نت', { status: 503 });
            });
        })
        .catch(error => {
          console.error('Cache match error:', error);
          return new Response('خطأ في النظام', { status: 500 });
        })
    );
  }
});

// معالجة الرسائل من التطبيق
self.addEventListener('message', (event) => {
  try {
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_LESSON':
        // حفظ درس للاستخدام بدون نت
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(`/lesson/${data.id}`, new Response(JSON.stringify(data)));
        }).catch(error => {
          console.error('Error caching lesson:', error);
        });
        break;

      case 'CACHE_USER_DATA':
        // حفظ بيانات المستخدم
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put('/user-data', new Response(JSON.stringify(data)));
        }).catch(error => {
          console.error('Error caching user data:', error);
        });
        break;

      case 'SKIP_WAITING':
        self.skipWaiting();
        break;

      default:
        console.warn('Unknown message type:', type);
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

// إشعارات Push (إذا كانت مدعومة)
self.addEventListener('push', (event) => {
  try {
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
        self.registration.showNotification(data.title, options).catch(error => {
          console.error('Error showing notification:', error);
        })
      );
    }
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// التعامل مع نقر الإشعارات
self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();

    if (event.action === 'open') {
      event.waitUntil(
        clients.openWindow('/').catch(error => {
          console.error('Error opening window:', error);
        })
      );
    }
  } catch (error) {
    console.error('Error handling notification click:', error);
  }
});

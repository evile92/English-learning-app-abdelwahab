const CACHE_NAME = 'stellarspeak-v2.2'; // تم تغيير الإصدار لتشغيل التحديث
const STATIC_CACHE = 'static-v2.2';
const DYNAMIC_CACHE = 'dynamic-v2.2';

// ملفات أساسية للتخزين بدون ملفات js/css ثابتة
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html', // ✅ تمت إضافة صفحة الأوفلاين هنا
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
  // 🛑 الإصلاح رقم 1: تمت إزالة event.preventDefault() لتحسين عملية تصحيح الأخطاء
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
        return Promise.resolve();
      }),
      
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
      
      self.clients.claim(),
      
      // ✅ الإصلاح رقم 2: تفعيل Navigation Preload
      self.registration.navigationPreload ? self.registration.navigationPreload.enable().catch(() => {}) : Promise.resolve()
      
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

  // ✅ الإصلاح رقم 3: تجاهل طلبات تحديث الـ Service Worker نفسه
  if (url.pathname.endsWith('/service-worker.js')) {
    return;
  }

  // استراتيجية محسّنة لصفحات الموقع (Navigation) مع استخدام Preload
  if (request.mode === 'navigate') {
    event.respondWith(
      event.preloadResponse
        .then(preloadResponse => {
          if (preloadResponse) {
            return preloadResponse;
          }
          return fetch(request);
        })
        .catch(() => {
          // إذا فشلت الشبكة، اعرض الصفحة الرئيسية من الكاش، ثم صفحة الأوفلاين
          return caches.match('/index.html')
            .then(cachedResponse => cachedResponse || caches.match('/offline.html'));
        })
    );
    return;
  }
  
  // استراتيجية "Cache First" لباقي الطلبات (API, CSS, JS, Images)
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // إذا وجدنا الطلب في الكاش، نعيده فوراً
      return cachedResponse || fetch(request).then(networkResponse => {
        // ونقوم بتخزينه في الكاش للمرة القادمة
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});

// معالجة الرسائل من التطبيق
self.addEventListener('message', (event) => {
  try {
    // ✅ الإصلاح رقم 4: التحقق من وجود الرسالة ونوعها لتنظيف الكونسول
    if (!event.data || !event.data.type) {
      return; // تجاهل الرسائل غير الصالحة بهدوء
    }

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
        // لم نعد بحاجة لهذا التحذير لأن الرسائل غير المعروفة يتم تجاهلها
        break;
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

const CACHE_NAME = 'stellarspeak-v2.2'; // ✅ تحديث الإصدار
const STATIC_CACHE = 'static-v2.2';
const DYNAMIC_CACHE = 'dynamic-v2.2';

// ✅ إضافة متغير لتتبع حالة التحديث
let isUpdating = false;

// ملفات أساسية للتخزين بدون ملفات js/css ثابتة
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
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

// ✅ إصلاح معالج الـ unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Promise Rejection:', event.reason);
  // ✅ إضافة event.preventDefault() لمنع انتشار الخطأ
  event.preventDefault();
  
  // ✅ إرسال رسالة للصفحة الرئيسية
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ERROR',
        error: event.reason?.toString() || 'Unknown promise rejection'
      });
    });
  }).catch(err => console.error('Error notifying clients:', err));
});

// إضافة معالج للأخطاء العامة
self.addEventListener('error', (event) => {
  console.error('Service Worker Error:', event.error);
  // ✅ إضافة إشعار للعملاء عن الأخطاء العامة
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_ERROR',
        error: event.error?.message || 'Unknown error'
      });
    });
  }).catch(err => console.error('Error notifying clients:', err));
});

// ✅ تحسين تثبيت Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // ✅ تحسين تخزين الملفات الأساسية مع معالجة أفضل للأخطاء
      caches.open(STATIC_CACHE)
        .then(cache => {
          return cache.addAll(STATIC_ASSETS).catch(error => {
            console.error('Error caching static assets:', error);
            // ✅ محاولة تخزين الملفات فردياً إذا فشل التخزين الجماعي
            return Promise.allSettled(
              STATIC_ASSETS.map(asset => cache.add(asset).catch(err => {
                console.warn(`Failed to cache ${asset}:`, err);
                return null;
              }))
            );
          });
        })
        .catch(error => {
          console.error('Critical error opening cache:', error);
          return Promise.resolve(); // لا نُفشل التثبيت
        }),
      
      self.skipWaiting()
    ]).catch(error => {
      console.error('Service Worker install error:', error);
      return Promise.resolve();
    })
  );
});

// ✅ تحسين تفعيل Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  isUpdating = true;
  
  event.waitUntil(
    Promise.all([
      // ✅ تحسين مسح الcaches القديمة بفلترة أفضل
      caches.keys().then(names => {
        return Promise.all(
          names.filter(name => 
            name !== STATIC_CACHE && 
            name !== DYNAMIC_CACHE &&
            // ✅ إضافة فلترة للcaches المتعلقة بـ stellarspeak فقط
            (name.startsWith('stellarspeak-') || 
             name.startsWith('static-') || 
             name.startsWith('dynamic-'))
          ).map(name => {
            console.log('Deleting old cache:', name);
            return caches.delete(name);
          })
        );
      }).catch(error => {
        console.error('Error cleaning old caches:', error);
        return Promise.resolve();
      }),
      
      self.clients.claim()
    ])
      .then(() => {
        isUpdating = false;
        console.log('Service Worker activated successfully');
        
        // ✅ إشعار العملاء بنجاح التحديث
        return self.clients.matchAll();
      })
      .then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            message: 'Service Worker updated successfully',
            version: CACHE_NAME
          });
        });
      })
      .catch(error => {
        console.error('Service Worker activate error:', error);
        isUpdating = false;
        return Promise.resolve();
      })
  );
});

// ✅ تحسين معالجة الطلبات
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ✅ تحسين تجاهل طلبات تحديث الـ Service Worker
  if (url.pathname.endsWith('/service-worker.js')) {
    if (isUpdating) {
      event.respondWith(new Response('Service Worker is updating', { 
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      }));
      return;
    }
    // السماح للطلب العادي
    return;
  }

  // ✅ تجاهل الطلبات غير الـ GET
  if (request.method !== 'GET') {
    return;
  }

  // ✅ تحسين تعامل مع طلبات Firebase
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) {
    event.respondWith(
      handleFirebaseRequest(request)
    );
    return;
  }

  // ✅ معالجة الطلبات العامة
  event.respondWith(
    handleGeneralRequest(request)
  );
});

// ✅ دالة جديدة لمعالجة طلبات Firebase
async function handleFirebaseRequest(request) {
  try {
    const response = await fetch(request);
    
    if (request.method === 'GET' && response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone()).catch(err => {
        console.warn('Could not cache Firebase response:', err);
      });
    }
    
    return response;
  } catch (error) {
    console.error('Firebase request failed:', error);
    
    // محاولة الحصول على نسخة محفوظة
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    return new Response('خدمة Firebase غير متاحة', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ✅ دالة جديدة لمعالجة الطلبات العامة
async function handleGeneralRequest(request) {
  try {
    // البحث في الcache أولاً
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    
    // جلب الطلب من الشبكة
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone()).catch(err => {
        console.warn('Could not cache response:', err);
      });
    }
    
    return response;
  } catch (error) {
    console.error('Request failed:', error);
    
    // ✅ تحسين معالجة طلبات التنقل (الصفحات)
    if (request.destination === 'document' || request.mode === 'navigate') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
      
      const indexPage = await caches.match('/index.html');
      if (indexPage) {
        return indexPage;
      }
      
      const rootPage = await caches.match('/');
      if (rootPage) {
        return rootPage;
      }
    }
    
    return new Response('المحتوى غير متاح بدون إنترنت', { 
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  }
}

// ✅ تحسين معالجة الرسائل من التطبيق
self.addEventListener('message', (event) => {
  try {
    // التحقق من صحة البيانات
    if (!event.data || typeof event.data !== 'object' || !event.data.type) {
      return; // تجاهل الرسائل غير الصالحة بهدوء
    }
    
    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_LESSON':
        if (data && data.id) {
          handleCacheLesson(data);
        }
        break;

      case 'CACHE_USER_DATA':
        if (data) {
          handleCacheUserData(data);
        }
        break;

      case 'SKIP_WAITING':
        self.skipWaiting();
        break;

      // ✅ إضافة نوع رسالة جديد للحصول على حالة Service Worker
      case 'GET_SW_STATUS':
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            isUpdating,
            version: CACHE_NAME,
            cacheStatus: 'active'
          });
        }
        break;

      default:
        // تجاهل الرسائل غير المعروفة بهدوء
        break;
    }
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

// ✅ دالة جديدة لتخزين الدروس
async function handleCacheLesson(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put(`/lesson/${data.id}`, new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }));
    console.log(`Lesson ${data.id} cached successfully`);
  } catch (error) {
    console.error('Error caching lesson:', error);
  }
}

// ✅ دالة جديدة لتخزين بيانات المستخدم
async function handleCacheUserData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put('/user-data', new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    }));
    console.log('User data cached successfully');
  } catch (error) {
    console.error('Error caching user data:', error);
  }
}

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

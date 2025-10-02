const CACHE_NAME = 'stellarspeak-v3.0';
const STATIC_CACHE = 'static-v3.0';
const DYNAMIC_CACHE = 'dynamic-v3.0';

// ملفات أساسية فقط
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  '/favicon.ico'
];

// تثبيت بسيط
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('SW: Install failed:', error);
      })
  );
});

// تفعيل بسيط
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('SW: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .then(() => console.log('SW: Activated successfully'))
      .catch(error => {
        console.error('SW: Activation failed:', error);
      })
  );
});

// معالجة الطلبات - بسيط جداً
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // تجاهل طلبات غير GET
  if (request.method !== 'GET') {
    return;
  }

  // تجاهل طلبات Service Worker نفسه
  if (url.pathname.endsWith('/service-worker.js')) {
    return;
  }

  // تجاهل طلبات Chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // تجاهل طلبات الإعلانات - هام جداً!
  if (url.hostname.includes('googlesyndication') || 
      url.hostname.includes('googletagmanager') ||
      url.hostname.includes('pagead2.googlesyndication')) {
    return; // لا نتدخل في الإعلانات
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then(fetchResponse => {
            // تخزين الاستجابات الناجحة فقط
            if (fetchResponse.ok && request.url.startsWith('https://')) {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone))
                .catch(() => {}); // تجاهل أخطاء التخزين
            }
            return fetchResponse;
          })
          .catch(() => {
            // في حالة عدم الاتصال، عرض الصفحة الأوفلاين
            if (request.destination === 'document') {
              return caches.match('/offline.html')
                .then(response => response || caches.match('/index.html'))
                .then(response => response || new Response('غير متاح بدون نت'));
            }
            return new Response('غير متاح', { status: 503 });
          });
      })
  );
});

// معالجة الرسائل
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

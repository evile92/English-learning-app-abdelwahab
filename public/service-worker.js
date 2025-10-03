const CACHE_NAME = 'stellarspeak-v2.3'; // تم تحديث الإصدار لتشغيل التحديث
const STATIC_CACHE = 'static-v2.3';
const DYNAMIC_CACHE = 'dynamic-v2.3';

// ملفات أساسية للتخزين مع إضافة ملفات مهمة
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
  lessons: [],
  vocabulary: [],
  userData: null
};

// ✅ التحسين رقم 1: إضافة معالج شامل للـ Promise Rejections
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker Unhandled Promise Rejection:', event.reason);
  
  // إذا كان الخطأ متعلق بـ Service Worker، قم بإرسال رسالة للصفحة الرئيسية
  if (event.reason && event.reason.message && 
      event.reason.message.includes('ServiceWorker')) {
    
    self.clients.matchAll({includeUncontrolled: true}).then(clients => {
      for (const client of clients) {
        client.postMessage({
          type: 'SERVICE_WORKER_ERROR',
          message: 'Service Worker encountered an error and may need to be reregistered',
          error: event.reason.message
        });
      }
    }).catch(() => {
      // تجاهل أخطاء postMessage
    });
  }
  
  // منع ظهور الخطأ في console للمستخدم النهائي
  event.preventDefault();
});

// ✅ التحسين رقم 2: معالج محسن للأخطاء العامة
self.addEventListener('error', (event) => {
  console.error('Service Worker General Error:', event.error);
  
  // إرسال تقرير خطأ للتطبيق الرئيسي
  self.clients.matchAll({includeUncontrolled: true}).then(clients => {
    for (const client of clients) {
      client.postMessage({
        type: 'SERVICE_WORKER_GENERAL_ERROR',
        message: 'Service Worker general error occurred',
        error: event.error ? event.error.message : 'Unknown error'
      });
    }
  }).catch(() => {
    // تجاهل أخطاء postMessage
  });
});

// ✅ التحسين رقم 3: تثبيت محسن مع error handling متقدم
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  const installPromise = Promise.all([
    // تخزين الملفات الأساسية مع retry mechanism
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(error => {
        console.error('Error caching static assets:', error);
        
        // محاولة تخزين الملفات واحد تلو الآخر في حالة فشل batch caching
        return Promise.allSettled(
          STATIC_ASSETS.map(asset => cache.add(asset).catch(e => {
            console.warn(`Failed to cache ${asset}:`, e);
            return null;
          }))
        );
      });
    }),
    
    // ✅ التحسين رقم 4: تهيئة cache للمحتوى الديناميكي
    caches.open(DYNAMIC_CACHE).then(cache => {
      // إنشاء cache فارغ للمحتوى الديناميكي
      return cache.put('/cache-initialized', new Response('Cache initialized', {
        headers: { 'Content-Type': 'text/plain' }
      }));
    }).catch(error => {
      console.error('Error initializing dynamic cache:', error);
      return Promise.resolve();
    })
  ]);
  
  event.waitUntil(
    installPromise.then(() => {
      console.log('Service Worker installed successfully');
      return self.skipWaiting(); // فرض التفعيل الفوري
    }).catch(error => {
      console.error('Service Worker install error:', error);
      
      // إرسال رسالة فشل التثبيت
      return self.clients.matchAll({includeUncontrolled: true}).then(clients => {
        for (const client of clients) {
          client.postMessage({
            type: 'INSTALL_FAILED',
            message: 'Service Worker installation failed',
            error: error.message
          });
        }
      }).then(() => {
        // عدم رفع الخطأ لمنع فشل التثبيت الكامل
        return Promise.resolve();
      });
    })
  );
});

// ✅ التحسين رقم 5: تفعيل محسن مع Navigation Preload
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  const activatePromise = Promise.all([
    // مسح الcaches القديمة مع improved versioning
    caches.keys().then(names => {
      const currentCaches = [STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME];
      return Promise.allSettled(
        names.filter(name => !currentCaches.includes(name))
             .map(name => {
               console.log('Deleting old cache:', name);
               return caches.delete(name);
             })
      );
    }).catch(error => {
      console.error('Error cleaning old caches:', error);
      return Promise.resolve();
    }),
    
    // ✅ تفعيل Navigation Preload مع fallback آمن
    (async () => {
      try {
        if ('navigationPreload' in self.registration) {
          await self.registration.navigationPreload.enable();
          console.log('Navigation preload enabled');
        }
      } catch (error) {
        console.log('Navigation preload not supported or failed:', error);
      }
    })(),
    
    // السيطرة على جميع العملاء
    self.clients.claim()
  ]);
  
  event.waitUntil(
    activatePromise.then(() => {
      console.log('Service Worker activated successfully');
      
      // إشعار العملاء بالتفعيل الناجح
      return self.clients.matchAll({includeUncontrolled: true}).then(clients => {
        for (const client of clients) {
          client.postMessage({
            type: 'SERVICE_WORKER_ACTIVATED',
            message: 'Service Worker activated successfully'
          });
        }
      });
    }).catch(error => {
      console.error('Service Worker activate error:', error);
      return Promise.resolve();
    })
  );
});

// ✅ التحسين رقم 6: معالجة طلبات محسنة مع Network Timeout
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // ✅ الحل: تجاهل Service Worker للدروس تماماً
  if (url.pathname === '/api/gemini' && request.method === 'POST') {
    return; // اتصال مباشر بدون Service Worker
  }


  // تجاهل طلبات Service Worker نفسه وطلبات Chrome Extension
  if (url.pathname.endsWith('/service-worker.js') || 
      url.protocol === 'chrome-extension:' ||
      url.protocol === 'chrome:') {
    return;
  }

  // ✅ التحسين رقم 7: Network timeout لتحسين الأداء
  const NETWORK_TIMEOUT = 8000; // 8 ثواني timeout

  const fetchWithTimeout = (request, timeout = NETWORK_TIMEOUT) => {
    return Promise.race([
      fetch(request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);
  };

  // استراتيجية محسنة للتنقل (Navigation requests)
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // محاولة استخدام preloadResponse أولاً
          if (event.preloadResponse) {
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }
          }
          
          // محاولة جلب من الشبكة مع timeout
          const networkResponse = await fetchWithTimeout(request);
          
          // تخزين الاستجابة في cache إذا كانت ناجحة
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            }).catch(() => {
              // تجاهل أخطاء التخزين
            });
          }
          
          return networkResponse;
          
        } catch (error) {
          console.log('Network request failed for navigation:', error.message);
          
          // البحث عن نسخة محفوظة من الصفحة المطلوبة
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;  
          }
          
          // العودة للصفحة الرئيسية ثم صفحة الأوفلاين
          const indexResponse = await caches.match('/index.html');
          if (indexResponse) {
            return indexResponse;
          }
          
          const offlineResponse = await caches.match('/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
          
          // إنشاء استجابة أوفلاين بسيطة
          return new Response(
            `<!DOCTYPE html>
            <html>
            <head>
              <title>StellarSpeak - Offline</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <h1>أنت الآن غير متصل</h1>
              <p>يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.</p>
              <button onclick="window.location.reload()">إعادة المحاولة</button>
            </body>
            </html>`,
            { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/html; charset=utf-8' }
            }
          );
        }
      })()
    );
    return;
  }

  // ✅ التحسين رقم 8: استراتيجية Cache First محسنة للموارد الثابتة
  if (request.destination === 'image' || 
      request.destination === 'style' || 
      request.destination === 'script' ||
      url.pathname.includes('/static/')) {
    
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // تحديث Cache في الخلفية إذا كان الطلب قديم (Cache Refresh Strategy)
          fetchWithTimeout(request).then(networkResponse => {
            if (networkResponse.ok) {
              caches.open(DYNAMIC_CACHE).then(cache => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => {
            // تجاهل أخطاء التحديث في الخلفية
          });
          
          return cachedResponse;
        }
        
        // إذا لم نجد في Cache، جلب من الشبكة
        return fetchWithTimeout(request).then(networkResponse => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // ✅ التحسين رقم 9: استراتيجية Network First للـ API calls
  if (url.pathname.includes('/api/') || url.pathname.includes('/auth/')) {
    event.respondWith(
      fetchWithTimeout(request, 5000) // timeout أقل للـ API
        .then(networkResponse => {
          // تخزين API responses الناجحة فقط
          if (networkResponse.ok && request.method === 'GET') {
            const responseClone = networkResponse.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(error => {
          console.log('API request failed:', error.message);
          
          // محاولة إرجاع نسخة محفوظة للـ GET requests فقط
          if (request.method === 'GET') {
            return caches.match(request).then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // إرجاع رسالة خطأ مناسبة
              return new Response(
                JSON.stringify({
                  error: 'Network unavailable',
                  message: 'Unable to fetch data. Please check your connection.',
                  offline: true
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
          }
          
          throw error; // لـ POST/PUT/DELETE requests
        })
    );
    return;
  }

  // للطلبات الأخرى - استراتيجية Cache First مع Network Fallback
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      return cachedResponse || fetchWithTimeout(request).then(networkResponse => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    }).catch(error => {
      console.log('Request failed:', error.message);
      
      // إرجاع استجابة افتراضية للمحتوى غير المتاح
      return new Response('المحتوى غير متاح حالياً', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});

// ✅ التحسين رقم 10: معالجة رسائل محسنة مع Validation
self.addEventListener('message', (event) => {
  try {
    // التحقق من صحة الرسالة
    if (!event.data || typeof event.data !== 'object' || !event.data.type) {
      return;
    }

    const { type, data } = event.data;

    switch (type) {
      case 'CACHE_LESSON':
        if (data && data.id) {
          caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.put(
              `/lesson/${data.id}`, 
              new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
              })
            );
          }).then(() => {
            // إرسال تأكيد نجح التخزين
            event.ports[0]?.postMessage({ success: true, type: 'LESSON_CACHED' });
          }).catch(error => {
            console.error('Error caching lesson:', error);
            event.ports[0]?.postMessage({ success: false, error: error.message });
          });
        }
        break;

      case 'CACHE_USER_DATA':
        if (data) {
          caches.open(DYNAMIC_CACHE).then(cache => {
            return cache.put(
              '/user-data', 
              new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
              })
            );
          }).then(() => {
            event.ports[0]?.postMessage({ success: true, type: 'USER_DATA_CACHED' });
          }).catch(error => {
            console.error('Error caching user data:', error);
            event.ports[0]?.postMessage({ success: false, error: error.message });
          });
        }
        break;

      case 'SKIP_WAITING':
        self.skipWaiting().then(() => {
          event.ports[0]?.postMessage({ success: true, type: 'SKIPPED_WAITING' });
        });
        break;

      case 'CLEAR_CACHE':
        Promise.all([
          caches.delete(DYNAMIC_CACHE),
          caches.delete(STATIC_CACHE)
        ]).then(() => {
          event.ports[0]?.postMessage({ success: true, type: 'CACHE_CLEARED' });
        }).catch(error => {
          console.error('Error clearing cache:', error);
          event.ports[0]?.postMessage({ success: false, error: error.message });
        });
        break;

      case 'GET_CACHE_STATUS':
        Promise.all([
          caches.has(STATIC_CACHE),
          caches.has(DYNAMIC_CACHE),
          caches.open(DYNAMIC_CACHE).then(cache => cache.keys()).then(keys => keys.length)
        ]).then(([hasStatic, hasDynamic, dynamicCount]) => {
          event.ports[0]?.postMessage({
            success: true,
            type: 'CACHE_STATUS',
            data: {
              staticCache: hasStatic,
              dynamicCache: hasDynamic,
              dynamicItemsCount: dynamicCount
            }
          });
        }).catch(error => {
          console.error('Error getting cache status:', error);
          event.ports[0]?.postMessage({ success: false, error: error.message });
        });
        break;

      default:
        console.log('Unknown message type:', type);
        break;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    event.ports[0]?.postMessage({ success: false, error: error.message });
  }
});

// ✅ التحسين رقم 11: Push notifications محسنة
self.addEventListener('push', (event) => {
  try {
    if (event.data) {
      const data = event.data.json();
      
      const options = {
        body: data.body || 'إشعار جديد من StellarSpeak',
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'stellarspeak-notification',
        data: data.url || '/', // لحفظ الرابط للنقر
        actions: [
          { action: 'open', title: 'فتح التطبيق' },
          { action: 'close', title: 'إغلاق' }
        ],
        requireInteraction: true, // يتطلب تفاعل المستخدم
        silent: false
      };

      event.waitUntil(
        self.registration.showNotification(
          data.title || 'StellarSpeak', 
          options
        ).catch(error => {
          console.error('Error showing notification:', error);
        })
      );
    }
  } catch (error) {
    console.error('Error handling push event:', error);
  }
});

// ✅ التحسين رقم 12: نقر الإشعارات محسن
self.addEventListener('notificationclick', (event) => {
  try {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
      const urlToOpen = event.notification.data || '/';
      
      event.waitUntil(
        self.clients.matchAll({
          type: 'window',
          includeUncontrolled: true
        }).then(clientList => {
          // البحث عن نافذة مفتوحة للتطبيق
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              client.navigate(urlToOpen);
              return client.focus();
            }
          }
          
          // فتح نافذة جديدة إذا لم توجد نافذة مفتوحة
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        }).catch(error => {
          console.error('Error handling notification click:', error);
        })
      );
    }
  } catch (error) {
    console.error('Error handling notification click:', error);
  }
});

// ✅ التحسين رقم 13: إضافة Sync event للعمل في الخلفية
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(
      syncUserData().catch(error => {
        console.error('Background sync failed:', error);
      })
    );
  }
});

// ✅ التحسين رقم 14: وظيفة مساعدة لمزامنة البيانات
async function syncUserData() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const userDataResponse = await cache.match('/user-data');
    
    if (userDataResponse) {
      const userData = await userDataResponse.json();
      
      // محاولة إرسال البيانات للخادم
      const response = await fetch('/api/sync-user-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (response.ok) {
        console.log('User data synced successfully');
        
        // إشعار العملاء بنجاح المزامنة
        const clients = await self.clients.matchAll();
        for (const client of clients) {
          client.postMessage({
            type: 'SYNC_SUCCESS',
            message: 'User data synced successfully'
          });
        }
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
    throw error; // لإعادة جدولة المزامنة
  }
}

// ✅ التحسين رقم 15: معلومات إضافية للتصحيح
console.log(`StellarSpeak Service Worker v2.3 loaded at ${new Date().toISOString()}`);
console.log('Cache names:', { STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME });
console.log('Static assets to cache:', STATIC_ASSETS);

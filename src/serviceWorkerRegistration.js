// This optional code is used to register a service worker.
// register() is not called by default.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// كشف الأجهزة المحمولة
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// دالة لحفظ أخطاء Service Worker للتشخيص
function logServiceWorkerError(error, context) {
  try {
    const errorLog = {
      message: error.message || String(error),
      stack: error.stack,
      context: context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      isMobile: isMobile,
      isLocalhost: isLocalhost,
      url: window.location.href
    };
    
    // حفظ في localStorage للمراجعة
    const existingErrors = JSON.parse(localStorage.getItem('sw_errors') || '[]');
    existingErrors.push(errorLog);
    // الاحتفاظ بآخر 10 أخطاء فقط
    localStorage.setItem('sw_errors', JSON.stringify(existingErrors.slice(-10)));
    
    console.error(`Service Worker Error (${context}):`, errorLog);
  } catch (logError) {
    console.warn('Failed to log SW error:', logError);
  }
}

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      console.warn('Service Worker: Public URL origin mismatch');
      return;
    }

    // تأخير التسجيل على الأجهزة المحمولة لتجنب المشاكل
    const registrationDelay = isMobile ? 1500 : 0;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

        if (isLocalhost) {
          checkValidServiceWorker(swUrl, config);
          
          navigator.serviceWorker.ready
            .then(() => {
              console.log('Service Worker: Ready in development mode');
            })
            .catch((error) => {
              logServiceWorkerError(error, 'Ready Check');
            });
        } else {
          registerValidSW(swUrl, config);
        }
      }, registrationDelay);
    });
  } else if (process.env.NODE_ENV !== 'production') {
    console.log('Service Worker: Skipped in development mode');
  } else if (!('serviceWorker' in navigator)) {
    console.log('Service Worker: Not supported in this browser');
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker: Registration successful', registration.scope);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Service Worker: New content available');
              
              if (config && config.onUpdate) {
                try {
                  config.onUpdate(registration);
                } catch (error) {
                  logServiceWorkerError(error, 'Update Callback');
                }
              }
            } else {
              console.log('Service Worker: Content cached for offline use');
              
              if (config && config.onSuccess) {
                try {
                  config.onSuccess(registration);
                } catch (error) {
                  logServiceWorkerError(error, 'Success Callback');
                }
              }
            }
          }
        };
      };
      
      // معالجة أخطاء التحديث
      registration.addEventListener('updatefound', () => {
        console.log('Service Worker: Update found');
      });
      
    })
    .catch((error) => {
      logServiceWorkerError(error, 'Registration');
      
      // إعادة المحاولة مرة واحدة على الأجهزة المحمولة
      if (isMobile && !window.swRegistrationRetried) {
        window.swRegistrationRetried = true;
        console.log('Service Worker: Retrying registration on mobile...');
        setTimeout(() => {
          registerValidSW(swUrl, config);
        }, 3000);
      }
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        console.warn('Service Worker: File not found, unregistering existing SW');
        
        navigator.serviceWorker.ready
          .then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            logServiceWorkerError(error, 'Unregister on 404');
          });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch((error) => {
      console.log('Service Worker: No internet connection, running offline');
      logServiceWorkerError(error, 'Fetch Check');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        return registration.unregister();
      })
      .then((success) => {
        if (success) {
          console.log('Service Worker: Successfully unregistered');
        }
      })
      .catch((error) => {
        logServiceWorkerError(error, 'Unregister');
      });
  }
}

// دالة إضافية لمسح أخطاء التشخيص (اختيارية)
export function clearServiceWorkerErrors() {
  try {
    localStorage.removeItem('sw_errors');
    console.log('Service Worker: Error logs cleared');
  } catch (error) {
    console.warn('Failed to clear SW error logs:', error);
  }
}

// دالة لعرض أخطاء التشخيص (للتطوير)
export function getServiceWorkerErrors() {
  try {
    return JSON.parse(localStorage.getItem('sw_errors') || '[]');
  } catch (error) {
    console.warn('Failed to get SW error logs:', error);
    return [];
  }
}

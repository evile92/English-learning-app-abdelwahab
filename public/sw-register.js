// إضافة هذا الكود في ملف main.js أو في <script> tag
if ('serviceWorker' in navigator) {
    // معالج للـ Promise rejections في النافذة الرئيسية
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection in main thread:', event.reason);
        
        // إذا كان الخطأ متعلق بـ Service Worker
        if (event.reason && event.reason.message && 
            event.reason.message.includes('ServiceWorker')) {
            
            console.log('Service Worker error detected, attempting recovery...');
            
            // إعادة تسجيل Service Worker
            navigator.serviceWorker.getRegistrations().then(function(registrations) {
                Promise.all(registrations.map(reg => reg.unregister())).then(() => {
                    setTimeout(() => {
                        registerServiceWorker();
                    }, 2000);
                });
            });
        }
        
        event.preventDefault();
    });

    function registerServiceWorker() {
        navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
            updateViaCache: 'none' // منع caching لملف Service Worker
        })
        .then(function(registration) {
            console.log('Service Worker registered successfully:', registration);
            
            // معالجة lifecycle events
            if (registration.installing) {
                trackInstalling(registration.installing);
            }
            
            registration.addEventListener('updatefound', function() {
                const newWorker = registration.installing;
                if (newWorker) {
                    trackInstalling(newWorker);
                }
            });
            
            // التحقق من التحديثات بشكل دوري (كل 30 دقيقة)
            setInterval(() => {
                registration.update().catch(error => {
                    console.log('Failed to check for updates:', error);
                });
            }, 30 * 60 * 1000);
            
        })
        .catch(function(error) {
            console.error('Service Worker registration failed:', error);
            
            // إعادة المحاولة بعد 5 ثواني
            setTimeout(() => {
                registerServiceWorker();
            }, 5000);
        });
    }
    
    function trackInstalling(worker) {
        worker.addEventListener('statechange', function() {
            if (worker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                    // Service Worker جديد متاح
                    showUpdateNotification();
                } else {
                    // Service Worker تم تثبيته لأول مرة
                    console.log('Service Worker installed for the first time');
                }
            } else if (worker.state === 'redundant') {
                console.error('Service Worker became redundant');
            }
        });
    }
    
    function showUpdateNotification() {
        // يمكنك إظهار إشعار للمستخدم هنا
        if (confirm('يتوفر تحديث جديد للتطبيق. هل تريد إعادة تحميل الصفحة؟')) {
            window.location.reload();
        }
    }
    
    // معالجة رسائل Service Worker
    navigator.serviceWorker.addEventListener('message', function(event) {
        const { type, message, error } = event.data;
        
        switch(type) {
            case 'SERVICE_WORKER_ERROR':
                console.error('Service Worker Error:', message);
                // يمكنك إظهار رسالة للمستخدم هنا
                break;
                
            case 'SERVICE_WORKER_ACTIVATED':
                console.log('Service Worker activated:', message);
                break;
                
            case 'INSTALL_FAILED':
                console.error('Service Worker installation failed:', message);
                // إعادة المحاولة
                setTimeout(() => {
                    registerServiceWorker();
                }, 5000);
                break;
        }
    });
    
    // بدء تسجيل Service Worker
    registerServiceWorker();
    
} else {
    console.log('Service Worker not supported');
}

// src/components/InstallPrompt.js
import React, { useState, useEffect } from 'react';
import { Download, X, Star, Zap, Wifi } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    // 🔍 فحص إذا كان التطبيق مثبت بالفعل
    const checkIfInstalled = () => {
      // PWA مثبت
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // iOS Safari
      if (window.navigator && window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }
      
      // فحص إضافي
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // 🎯 التقاط حدث beforeinstallprompt
    const handleBeforeInstallPrompt = (e) => {
      console.log('🎯 Install prompt event captured');
      e.preventDefault(); // منع الظهور الافتراضي
      setDeferredPrompt(e);
      
      // إظهار الـ prompt المخصص بعد تفاعل المستخدم
      setTimeout(() => {
        if (!isInstalled && userInteracted) {
          setShowPrompt(true);
        }
      }, 2000);
    };

    // 🕵️ تتبع تفاعل المستخدم
    const handleUserInteraction = () => {
      setUserInteracted(true);
      
      // إظهار prompt إذا كان محفوظ ولم يظهر بعد
      if (deferredPrompt && !showPrompt && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    // 📱 معالجة تثبيت التطبيق
    const handleAppInstalled = () => {
      console.log('✅ App installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      
      // حفظ حالة التثبيت
      localStorage.setItem('pwa_installed', 'true');
    };

    // إضافة مستمعين للأحداث
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    // تتبع التفاعل
    ['click', 'scroll', 'keydown'].forEach(event => {
      document.addEventListener(event, handleUserInteraction, { once: true });
    });

    // تنظيف
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deferredPrompt, isInstalled, showPrompt, userInteracted]);

  // 📊 معالج التثبيت
  const handleInstall = async () => {
    if (!deferredPrompt) {
      console.log('❌ No deferred prompt available');
      // عرض تعليمات يدوية للتثبيت
      console.log('Manual install instructions needed');
      return;
    }

    try {
      console.log('🚀 Starting install process...');
      
      // إظهار prompt الأصلي
      const result = await deferredPrompt.prompt();
      console.log('Install prompt result:', result);
      
      // انتظار اختيار المستخدم
      const choiceResult = await deferredPrompt.userChoice;
      console.log('User choice:', choiceResult);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        
        // إخفاء الـ prompt وحفظ الحالة
        setShowPrompt(false);
        localStorage.setItem('install_dismissed', 'true');
      } else {
        console.log('❌ User dismissed the install prompt');
        handleDismiss();
      }
      
      // تنظيف
      setDeferredPrompt(null);
      
    } catch (error) {
      console.error('Install error:', error);
      console.log('Manual install instructions needed');
    }
  };

  // معالج رفض التثبيت
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('install_dismissed_date', Date.now().toString());
    
    // عدم الإظهار مرة أخرى لمدة 7 أيام
    setTimeout(() => {
      localStorage.removeItem('install_dismissed_date');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // فحص إذا كان مرفوض مؤخراً
  const isRecentlyDismissed = () => {
    const dismissedDate = localStorage.getItem('install_dismissed_date');
    if (!dismissedDate) return false;
    
    const daysSinceDismiss = (Date.now() - parseInt(dismissedDate)) / (24 * 60 * 60 * 1000);
    return daysSinceDismiss < 7;
  };

  // عدم الإظهار في هذه الحالات
  if (isInstalled || !showPrompt || isRecentlyDismissed()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 z-50 animate-slide-up">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center">
              <img src="/logo192.webp" alt="StellarSpeak" className="w-10 h-10 rounded-lg" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                ثبت StellarSpeak
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                للوصول السريع وتجربة أفضل
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* المميزات */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center">
            <Zap className="mx-auto text-yellow-500 mb-1" size={20} />
            <span className="text-xs text-gray-600 dark:text-gray-300">أسرع</span>
          </div>
          <div className="text-center">
            <Wifi className="mx-auto text-green-500 mb-1" size={20} />
            <span className="text-xs text-gray-600 dark:text-gray-300">أوفلاين</span>
          </div>
          <div className="text-center">
            <Star className="mx-auto text-purple-500 mb-1" size={20} />
            <span className="text-xs text-gray-600 dark:text-gray-300">إشعارات</span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Download size={18} />
            تثبيت الآن
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;

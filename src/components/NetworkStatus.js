// src/components/NetworkStatus.js

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [notificationType, setNotificationType] = useState('offline');

  useEffect(() => {
    const handleOnline = () => {
      if (!isOnline) { // فقط أظهر الإشعار إذا كانت الحالة السابقة "غير متصل"
        setIsOnline(true);
        setNotificationType('online');
        setShowNotification(true);
        setIsVisible(true);
        
        setTimeout(() => {
          setIsVisible(false);
          // انتظر انتهاء الأنيميشن قبل الإخفاء الكامل
          setTimeout(() => setShowNotification(false), 500);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotificationType('offline');
      setShowNotification(true);
      setIsVisible(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // إذا كان النت مقطوع من البداية عند تحميل الصفحة
    if (!navigator.onLine) {
      handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]); // أضف isOnline للاعتماديات

  if (!showNotification) return null;

  const isOffline = notificationType === 'offline';

  return (
    <div 
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
      }`}
    >
      <div 
        className={`
          flex items-center gap-3 py-3 px-6 rounded-full shadow-2xl border
          text-white font-semibold backdrop-blur-lg
          ${isOffline 
            ? 'bg-red-500/80 border-red-400/50' 
            : 'bg-green-500/80 border-green-400/50'
          }
        `}
      >
        {isOffline ? <WifiOff size={20} /> : <Wifi size={20} />}
        <span>
          {isOffline ? 'لا يوجد اتصال بالإنترنت' : 'تم استعادة الاتصال'}
        </span>
      </div>
    </div>
  );
};

export default NetworkStatus;

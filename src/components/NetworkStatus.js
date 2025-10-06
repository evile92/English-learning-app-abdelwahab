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
  }, [isOnline]);

  if (!showNotification) return null;

  const isOffline = notificationType === 'offline';

  return (
    // --- بداية التعديل ---
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div 
        className={`
          flex items-center justify-center gap-2 py-2 px-4 w-full
          text-white text-sm font-semibold backdrop-blur-md
          ${isOffline 
            ? 'bg-red-500/90' 
            : 'bg-green-500/90'
          }
        `}
      >
        {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
        <span>
          {isOffline ? 'لا يوجد اتصال بالإنترنت. تعمل في وضع عدم الاتصال.' : 'تم استعادة الاتصال بالإنترنت.'}
        </span>
      </div>
    </div>
    // --- نهاية التعديل ---
  );
};

export default NetworkStatus;

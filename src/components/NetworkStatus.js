// src/components/NetworkStatus.js

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('offline');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setNotificationType('online');
      setShowNotification(true);
      
      // إخفاء إشعار العودة بعد 3 ثواني
      setTimeout(() => {
        setShowNotification(false);
      }, 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setNotificationType('offline');
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // إذا كان النت مقطوع من البداية
    if (!navigator.onLine) {
      setShowNotification(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // إخفاء الإشعار عند العودة للإنترنت
  useEffect(() => {
    if (isOnline && notificationType === 'offline') {
      setShowNotification(false);
    }
  }, [isOnline, notificationType]);

  if (!showNotification) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ${
      showNotification ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {notificationType === 'offline' ? (
        // إشعار انقطاع النت
        <div className="bg-red-500 text-white px-4 py-3 text-center flex items-center justify-center gap-2 shadow-lg">
          <WifiOff size={20} />
          <span className="font-semibold">
            📡 لا يوجد اتصال بالإنترنت - تعمل في وضع بدون اتصال
          </span>
        </div>
      ) : (
        // إشعار عودة النت
        <div className="bg-green-500 text-white px-4 py-3 text-center flex items-center justify-center gap-2 shadow-lg">
          <Wifi size={20} />
          <span className="font-semibold">
            ✅ تم استعادة الاتصال بالإنترنت
          </span>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;

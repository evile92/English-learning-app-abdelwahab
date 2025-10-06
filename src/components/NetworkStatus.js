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
      if (!isOnline) {
        setIsOnline(true);
        setNotificationType('online');
        setShowNotification(true);
        setIsVisible(true);
        
        setTimeout(() => {
          setIsVisible(false);
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
    // --- بداية التعديل النهائي ---
    <div 
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
      }`}
    >
      <div 
        className={`
          flex items-center gap-2.5 py-2.5 px-5 rounded-full shadow-2xl border
          text-white text-sm font-semibold backdrop-blur-lg whitespace-nowrap
          ${isOffline 
            ? 'bg-red-500/80 border-red-400/50' 
            : 'bg-green-500/80 border-green-400/50'
          }
        `}
      >
        {isOffline ? <WifiOff size={18} /> : <Wifi size={18} />}
        <span>
          {isOffline ? 'لا يوجد اتصال بالإنترنت' : 'تم استعادة الاتصال'}
        </span>
      </div>
    </div>
    // --- نهاية التعديل النهائي ---
  );
};

export default NetworkStatus;

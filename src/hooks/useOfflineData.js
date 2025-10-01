// src/hooks/useOfflineData.js

import { useState, useEffect } from 'react';

export const useOfflineData = (key, defaultValue) => {
  const [data, setData] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // حفظ البيانات محلياً
  const saveOfflineData = async (newData) => {
    try {
      // حفظ في localStorage
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData));
      
      // حفظ في Service Worker Cache
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        registration.active.postMessage({
          type: 'CACHE_DATA',
          key,
          data: newData
        });
      }
      
      setData(newData);
    } catch (error) {
      console.error('فشل حفظ البيانات للاستخدام بدون نت:', error);
    }
  };

  // تحميل البيانات المحفوظة
  const loadOfflineData = async () => {
    try {
      setIsLoading(true);
      
      // محاولة تحميل من localStorage أولاً
      const saved = localStorage.getItem(`offline_${key}`);
      if (saved) {
        const parsedData = JSON.parse(saved);
        setData(parsedData);
        return parsedData;
      }
      
      // محاولة تحميل من Service Worker Cache
      if ('caches' in window) {
        const cache = await caches.open('stellarspeak-offline');
        const response = await cache.match(`/offline/${key}`);
        if (response) {
          const cachedData = await response.json();
          setData(cachedData);
          return cachedData;
        }
      }
      
      return defaultValue;
    } catch (error) {
      console.error('فشل تحميل البيانات بدون نت:', error);
      return defaultValue;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOfflineData();
  }, [key]);

  return { data, saveOfflineData, loadOfflineData, isLoading };
};

// Hook للكشف عن حالة الاتصال
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

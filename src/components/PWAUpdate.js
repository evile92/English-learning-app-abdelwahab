// src/components/PWAUpdate.js

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const PWAUpdate = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState(null);

  useEffect(() => {
    // التحقق من التحديثات
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // إعادة تحميل عند التحديث
        window.location.reload();
      });

      navigator.serviceWorker.ready.then(registration => {
        // مراقبة التحديثات الجديدة
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShowUpdatePrompt(true);
            }
          });
        });

        // فحص التحديثات كل 30 ثانية
        setInterval(() => {
          registration.update();
        }, 30000);
      });
    }
  }, []);

  const updateApp = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdatePrompt(false);
    }
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Download className="text-white" size={24} />
          <div>
            <h3 className="font-bold">تحديث جديد متاح! 🚀</h3>
            <p className="text-sm opacity-90">ميزات جديدة وتحسينات في الأداء</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={updateApp}
            className="bg-white text-blue-600 px-4 py-2 rounded font-bold hover:bg-gray-100 transition-all"
          >
            تحديث الآن
          </button>
          <button
            onClick={() => setShowUpdatePrompt(false)}
            className="p-2 hover:bg-white/20 rounded transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdate;

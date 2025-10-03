// src/App.js

import React, { useEffect, useState, useRef } from 'react'; // ✅ إضافة useRef
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageRouter from './components/PageRouter';
import ProfileModal from './components/ProfileModal';
import StellarSpeakLogo from './components/StellarSpeakLogo';
import DesktopFooter from './components/layout/DesktopFooter';
import AchievementPopup from './components/modals/AchievementPopup';
import ExamPrompt from './components/modals/ExamPrompt';
import LevelPrompt from './components/modals/LevelPrompt';
import RegisterPrompt from './components/modals/RegisterPrompt';
import GoalReachedPopup from './components/modals/GoalReachedPopup';
import MoreMenu from './components/modals/MoreMenu';
import AnnouncementModal from './components/modals/AnnouncementModal';

import MaintenanceScreen from './components/MaintenanceScreen';
// إضافة Error Boundaries
import ErrorBoundary from './components/ErrorBoundary';
import { PageErrorBoundary, InteractiveErrorBoundary } from './components/SpecializedErrorBoundaries';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
// ✅ إضافة PWA components
import PWAUpdate from './components/PWAUpdate';
import NetworkStatus from './components/NetworkStatus';
import PWANotificationService from './services/PWANotificationService';

export default function App() {
  const { 
    isDarkMode, setIsDarkMode, 
    isProfileModalOpen, setIsProfileModalOpen,
    authStatus, user, userData,
    dailyGoal, timeSpent, setTimeSpent,
    userName, handlePageChange, handleLogout,
    page, userLevel,
    isMaintenanceMode 
  } = useAppContext();

  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);

  // ✅ إضافة المتغيرات المرجعية لحل مشكلة تسرب الذاكرة
  const dailyGoalAchievedRef = useRef(false);
  const intervalRef = useRef(null);

  // دالة للعودة إلى لوحة التحكم عند حدوث خطأ فادح
  const handleGoHomeOnError = () => {
    handlePageChange('dashboard');
    // إعادة تحميل قسرية للحالة الطارئة
    window.location.reload();
  };

  // ✅ إضافة PWA useEffect
  useEffect(() => {
    // طلب إذن الإشعارات عند أول تحميل
    PWANotificationService.requestPermission();
    
    // جدولة تذكير يومي
    PWANotificationService.scheduleStudyReminder();
  }, []);

  // ✅ useEffect محسن لتتبع الوقت مع حل مشكلة تسرب الذاكرة
  useEffect(() => {
    const today = new Date().toDateString();
    
    // تحديث حالة تحقيق الهدف في الـ ref
    dailyGoalAchievedRef.current = localStorage.getItem('dailyGoalAchievedDate') === today;

    // تنظيف أي interval سابق
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }

    if (!timeSpent || timeSpent.date !== today) {
        setTimeSpent({ time: 0, date: today });
        dailyGoalAchievedRef.current = false;
        localStorage.removeItem('dailyGoalAchievedDate');
    }
    
    intervalRef.current = setInterval(() => {
        // استخدام ref بدلاً من متغير closure
        if (document.hidden || dailyGoalAchievedRef.current) {
            return;
        }

        setTimeSpent(prev => {
            const currentTime = prev ? prev.time : 0;
            const newTime = currentTime + 10;
            
            if (newTime >= dailyGoal * 60) {
                if (!dailyGoalAchievedRef.current) {
                    setShowGoalReachedPopup(true);
                    localStorage.setItem('dailyGoalAchievedDate', today);
                    dailyGoalAchievedRef.current = true; // تحديث الـ ref
                }
            }
            return { time: newTime, date: today };
        });

    }, 10000);

    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
  }, [dailyGoal, setTimeSpent]); // إزالة timeSpent من dependencies

  // ✅ تنظيف إضافي عند إغلاق التطبيق
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (authStatus === 'loading' || (user && userData === null)) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900"> {/* ✅ تغيير إلى flex-col */}
        <StellarSpeakLogo />
        {/* ✅ إضافة مؤشر تحميل محسن */}
        <div className="mt-4 text-white text-center">
          <div className="animate-pulse">جاري التحميل...</div>
          <div className="mt-2 w-32 bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  // (إضافة 3): التحقق من وضع الصيانة قبل عرض التطبيق
  if (isMaintenanceMode && !userData?.isAdmin) {
    return <MaintenanceScreen />;
  }

  return (
    <HelmetProvider>
      <SEO />
      {/* ✅ إضافة PWA components */}
      <NetworkStatus />
      <PWAUpdate />
      
      <ErrorBoundary 
        isDarkMode={isDarkMode} 
        onGoHome={handleGoHomeOnError}
        showHomeButton={true}
        title="خطأ جسيم في التطبيق"
        message="حدث خطأ غير متوقع أدى إلى توقف التطبيق. سيتم إعادتك إلى الصفحة الرئيسية."
      >
        {/* Backgrounds */}
        <InteractiveErrorBoundary isDarkMode={isDarkMode}>
          <div id="background-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
              <div id="nebula-bg"></div>
              <div id="stars-bg"></div>
          </div>
          {!isDarkMode && (
            <div id="light-background-container" className="fixed inset-0 z-0 overflow-hidden">
                <div id="light-stars"></div>
                <div id="light-twinkles"></div>
                <div id="light-nebula"></div>
            </div>
          )}
        </InteractiveErrorBoundary>

        {/* App Container */}
        <div className={`relative z-10 min-h-screen font-sans flex flex-col ${isDarkMode ? 'bg-transparent text-slate-200' : 'bg-transparent text-slate-800'}`}>
          <InteractiveErrorBoundary isDarkMode={isDarkMode}>
            <Header />
          </InteractiveErrorBoundary>

          <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8 flex-grow">
            <PageErrorBoundary 
              isDarkMode={isDarkMode} 
              onGoHome={() => handlePageChange('dashboard')}
            >
              <PageRouter 
                page={page} 
                user={user} 
                userName={userName}
                userLevel={userLevel}
              />
            </PageErrorBoundary>
          </main>
          
          {/* Modals, Popups, and Menus */}
          <InteractiveErrorBoundary isDarkMode={isDarkMode}>
            <AnnouncementModal />
            <AchievementPopup />
            <ExamPrompt />
            <LevelPrompt />
            <RegisterPrompt />
            <MoreMenu />

            {showGoalReachedPopup && (
              <GoalReachedPopup 
                dailyGoal={dailyGoal} 
                onClose={() => setShowGoalReachedPopup(false)} 
              />
            )}
            
            {isProfileModalOpen && (
              <ProfileModal 
                user={user}
                userName={userName}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                handlePageChange={handlePageChange}
                handleLogout={handleLogout}
                onClose={() => setIsProfileModalOpen(false)}
              />
            )}
          </InteractiveErrorBoundary>
          
          <InteractiveErrorBoundary isDarkMode={isDarkMode}>
            <DesktopFooter /> 
            <Footer />
          </InteractiveErrorBoundary>
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

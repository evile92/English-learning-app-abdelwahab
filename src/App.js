// src/App.js

import React, { useEffect, useState } from 'react';
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

export default function App() {
  const { 
    isDarkMode, setIsDarkMode, 
    isProfileModalOpen, setIsProfileModalOpen,
    authStatus, user, userData,
    dailyGoal, timeSpent, setTimeSpent,
    userName, handlePageChange, handleLogout,
    page, userLevel,
    isMaintenanceMode // (إضافة 2): جلب حالة وضع الصيانة
  } = useAppContext();

  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);

  // دالة للعودة إلى لوحة التحكم عند حدوث خطأ فادح
  const handleGoHomeOnError = () => {
    handlePageChange('dashboard');
    // إعادة تحميل قسرية للحالة الطارئة
    window.location.reload();
  };

  useEffect(() => {
    const today = new Date().toDateString();
    let dailyGoalAchievedToday = localStorage.getItem('dailyGoalAchievedDate') === today;

    if (!timeSpent || timeSpent.date !== today) {
        setTimeSpent({ time: 0, date: today });
        dailyGoalAchievedToday = false;
        localStorage.removeItem('dailyGoalAchievedDate');
    }
    
    const interval = setInterval(() => {
        if (document.hidden || dailyGoalAchievedToday) {
            return;
        }

        setTimeSpent(prev => {
            const currentTime = prev ? prev.time : 0;
            const newTime = currentTime + 10;
            
            if (newTime >= dailyGoal * 60) {
                if (!dailyGoalAchievedToday) {
                    setShowGoalReachedPopup(true);
                    localStorage.setItem('dailyGoalAchievedDate', today);
                }
                dailyGoalAchievedToday = true;
            }
            return { time: newTime, date: today };
        });

    }, 10000);

    return () => clearInterval(interval);
  }, [dailyGoal, setTimeSpent, timeSpent]);

  if (authStatus === 'loading' || (user && userData === null)) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
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

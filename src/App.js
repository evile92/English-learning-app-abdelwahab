// src/App.js
import React, { useEffect, useState } from 'react';
import { useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageRouter from './components/PageRouter';
import ProfileModal from './components/ProfileModal';
import StellarSpeakLogo from './components/StellarSpeakLogo';

// استيراد المكونات الجديدة من مجلد modals
import AchievementPopup from './components/modals/AchievementPopup';
import ExamPrompt from './components/modals/ExamPrompt';
import LevelPrompt from './components/modals/LevelPrompt';
import RegisterPrompt from './components/modals/RegisterPrompt';
import GoalReachedPopup from './components/modals/GoalReachedPopup';
import MoreMenu from './components/modals/MoreMenu';

export default function App() {
  const { 
    isDarkMode, setIsDarkMode, 
    isProfileModalOpen, setIsProfileModalOpen,
    authStatus, isSyncing,
    dailyGoal, timeSpent, setTimeSpent,
    user, userName, handlePageChange, handleLogout // استدعاء البيانات والدوال التي سنمررها
  } = useAppContext();

  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);

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
  }, [dailyGoal, timeSpent, setTimeSpent]);

  // شاشة التحميل
  if (authStatus === 'loading' || isSyncing) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
      </div>
    );
  }

  // الواجهة الرئيسية للتطبيق
  return (
    <>
      {/* Backgrounds */}
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

      {/* App Container */}
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-transparent text-slate-200' : 'bg-transparent text-slate-800'}`}>
        <Header />

        <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8">
            <PageRouter />
        </main>
        
        {/* Modals, Popups, and Menus */}
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
        
        {/* === ✨ هنا تم الإصلاح ✨ === */}
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
        
        <Footer />
      </div>
    </>
  );
}


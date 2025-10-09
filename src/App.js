// src/App.js

import React, { useEffect, useState, useRef } from 'react';
// 1. استيراد Navigate
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// --- استيراد مكونات الواجهة الرئيسية ---
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
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
import ErrorBoundary from './components/ErrorBoundary';
import { PageErrorBoundary, InteractiveErrorBoundary } from './components/SpecializedErrorBoundaries';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/SEO';
import PWAUpdate from './components/PWAUpdate';
import NetworkStatus from './components/NetworkStatus';
import InstallPrompt from './components/InstallPrompt';
import PWANotificationService from './services/PWANotificationService';


// --- استيراد مكونات الصفحات الفعلية ---
import AdminDashboard from './components/AdminDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import PlacementTest from './components/PlacementTest';
import NameEntryScreen from './components/NameEntryScreen';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import LessonContent from './components/LessonContent';
import WritingSection from './components/WritingSection';
import ReadingCenter from './components/ReadingCenter';
import RolePlaySection from './components/RolePlaySection';
import PronunciationCoach from './components/PronunciationCoach';
import ReviewSection from './components/ReviewSection';
import Login from './components/Login';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import EditProfilePage from './components/EditProfilePage';
import MyVocabulary from './components/MyVocabulary';
import ReviewSession from './components/ReviewSession';
import Certificate from './components/Certificate';
import FinalExam from './components/FinalExam';
import SmartFocusSection from './components/SmartFocusSection';
import SmartFocusQuiz from './components/SmartFocusQuiz';
import GrammarGuide from './components/GrammarGuide';
import VerbListComponent from './components/VerbListComponent';
import IdiomsAndPhrases from './components/IdiomsAndPhrases';
import VocabularyGuide from './components/VocabularyGuide';
import ListeningCenter from './components/ListeningCenter';
import Blog from './components/Blog';
import PrivacyPolicy from './components/PrivacyPolicy';
import ContactPage from './components/ContactPage';
import AboutPage from './components/About';
import NotificationsPage from './components/NotificationsPage';
import SearchPage from './components/SearchPage';


export default function App() {
  const {
    isDarkMode, setIsDarkMode,
    isProfileModalOpen, setIsProfileModalOpen,
    authStatus, user, userData,
    dailyGoal, timeSpent, setTimeSpent,
    userName, handleLogout,
    userLevel,
    isMaintenanceMode,
    handleTestComplete,
    initialLevels,
    handleNameSubmit,
    tempUserLevel
  } = useAppContext();

  const navigate = useNavigate();

  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // ✅ الحل الذكي: قراءة localStorage مباشرة وبشكل متزامن
  const [immediateStorageCheck] = useState(() => {
    try {
      return {
        tempLevel: JSON.parse(localStorage.getItem('stellarSpeakTempLevel') || 'null'),
        tempName: localStorage.getItem('stellarSpeakTempName') || '',
        hasStorageData: localStorage.getItem('stellarSpeakTempLevel') !== null
      };
    } catch {
      return { tempLevel: null, tempName: '', hasStorageData: false };
    }
  });

  const dailyGoalAchievedRef = useRef(false);
  const intervalRef = useRef(null);

  const handleGoHomeOnError = () => {
    navigate('/dashboard');
    window.location.reload();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    PWANotificationService.requestPermission();
    PWANotificationService.scheduleStudyReminder();
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    dailyGoalAchievedRef.current = localStorage.getItem('dailyGoalAchievedDate') === today;
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
    }
    if (!timeSpent || timeSpent.date !== today) {
        setTimeSpent({ time: 0, date: today });
        dailyGoalAchievedRef.current = false;
        localStorage.removeItem('dailyGoalAchievedDate');
    }
    intervalRef.current = setInterval(() => {
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
                    dailyGoalAchievedRef.current = true;
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
  }, [dailyGoal, setTimeSpent]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // ✅ شاشة تحميل سريعة - بدون تأخير إضافي
  if (authStatus === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
        <div className="mt-4 text-white text-center">
          <div className="animate-pulse">جاري التحميل...</div>
          <div className="mt-2 w-32 bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (user && userData === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
        <div className="mt-4 text-white text-center">
          <div className="animate-pulse">جاري تحميل ملفك الشخصي...</div>
          <div className="mt-2 w-32 bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (isMaintenanceMode && !userData?.isAdmin) {
    return <MaintenanceScreen />;
  }

  // ✅ الحل الذكي: استخدام القراءة المباشرة للـ localStorage مع fallback
  const isNewVisitor = initialLoadComplete && !user && !tempUserLevel && !immediateStorageCheck.tempLevel;

  return (
    <HelmetProvider>
      <SEO />
      <NetworkStatus />
      <PWAUpdate />
      <InstallPrompt />
      
      <ErrorBoundary
        isDarkMode={isDarkMode}
        onGoHome={handleGoHomeOnError}
        showHomeButton={true}
        title="خطأ جسيم في التطبيق"
        message="حدث خطأ غير متوقع أدى إلى توقف التطبيق. سيتم إعادتك إلى الصفحة الرئيسية."
      >
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

        <div className={`relative z-10 min-h-screen font-sans flex flex-col ${isDarkMode ? 'bg-transparent text-slate-200' : 'bg-transparent text-slate-800'}`}>
          <InteractiveErrorBoundary isDarkMode={isDarkMode}>
            <Header />
          </InteractiveErrorBoundary>

          <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8 flex-grow">
            <PageErrorBoundary
              isDarkMode={isDarkMode}
              onGoHome={() => navigate('/dashboard')}
            >
              <Routes>
                {/* الصفحات التي لا تتطلب تسجيل دخول */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/welcome" element={<WelcomeScreen onStart={() => navigate('/test')} />} />
                <Route path="/test" element={<PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />} />
                <Route path="/nameEntry" element={<NameEntryScreen onNameSubmit={handleNameSubmit} />} />

                {/* --- 3. بداية التعديل المطلوب --- */}
                {/* إذا كان زائراً جديداً، قم بتوجيهه إلى صفحة الترحيب. وإلا، اعرض المجرة */}
                <Route path="/" element={
                  !initialLoadComplete ? 
                    <div className="flex justify-center items-center h-screen">
                      <StellarSpeakLogo />
                    </div> :
                    isNewVisitor ? <Navigate to="/welcome" replace /> : <Dashboard />
                } />
                {/* --- نهاية التعديل المطلوب --- */}
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/lessons" element={<LessonView />} />
                <Route path="/lesson/:lessonId" element={<LessonContent />} />
                <Route path="/writing" element={<WritingSection />} />
                <Route path="/reading" element={<ReadingCenter />} />
                <Route path="/vocabulary" element={<MyVocabulary />} />
                <Route path="/roleplay" element={<RolePlaySection />} />
                <Route path="/pronunciation" element={<PronunciationCoach />} />
                <Route path="/review" element={<ReviewSection />} />
                <Route path="/review-session" element={<ReviewSession />} />
                <Route path="/final-exam" element={<FinalExam />} />
                <Route path="/smart-focus" element={<SmartFocusSection />} />
                <Route path="/smart-focus-quiz" element={<SmartFocusQuiz />} />
                <Route path="/grammar" element={<GrammarGuide />} />
                <Route path="/verb-list" element={<VerbListComponent />} />
                <Route path="/idioms" element={<IdiomsAndPhrases />} />
                <Route path="/vocabulary-guide" element={<VocabularyGuide />} />
                <Route path="/listening" element={<ListeningCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/edit-profile" element={<EditProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/certificate/:levelId" element={<Certificate />} />
                
                {/* المسارات الصحيحة للمدونة */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<Blog />} />

                <Route path="*" element={<Dashboard />} />
              </Routes>
            </PageErrorBoundary>
          </main>
          
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

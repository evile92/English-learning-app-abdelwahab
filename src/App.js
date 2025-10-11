// src/App.js

// --- ✅ [التعديل] إضافة Navigate إلى الاستيراد ---
import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// --- استيراد المكونات (بدون تغيير) ---
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

// --- ❌ [التعديل] تم حذف مكون InitialRoute بالكامل ---


// --- ✅ [التعديل] إنشاء مكون MainContent الجديد مع منطق التوجيه الشرطي ---
const MainContent = () => {
  const { 
    authStatus, 
    user, 
    userData,
    isDarkMode,
    handleTestComplete,
    initialLevels,
    handleNameSubmit
  } = useAppContext();
  const navigate = useNavigate();

  // 1. عرض حالات التحميل أولاً
  if (authStatus === 'loading') {
    return (
      <div className="flex flex-col justify-center items-center h-full flex-grow">
        <StellarSpeakLogo />
        <div className="mt-4 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (user && userData === null) {
    return (
      <div className="flex flex-col justify-center items-center h-full flex-grow">
        <StellarSpeakLogo />
        <div className="mt-4 text-center">
          <div className="animate-pulse">جاري تحميل ملفك الشخصي...</div>
        </div>
      </div>
    );
  }

  // 2. تعريف المسارات بناءً على حالة تسجيل الدخول
  return (
    <PageErrorBoundary isDarkMode={isDarkMode} onGoHome={() => navigate('/')}>
      <Routes>
        {user ? (
          <>
            {/* === المسارات الخاصة بالمستخدم المسجل === */}
            <Route path="/" element={<Dashboard />} />
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
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/certificate/:levelId" element={<Certificate />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/welcome" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* === المسارات الخاصة بالزائر === */}
            <Route path="/welcome" element={<WelcomeScreen onStart={() => navigate('/test')} />} />
            <Route path="/test" element={<PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />} />
            <Route path="/nameEntry" element={<NameEntryScreen onNameSubmit={handleNameSubmit} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </>
        )}
      </Routes>
    </PageErrorBoundary>
  );
}


// --- ✅ [التعديل] تعديل مكون App الرئيسي ليفصل الهيكل عن المحتوى ---
export default function App() {
  const {
    isDarkMode, setIsDarkMode,
    isProfileModalOpen, setIsProfileModalOpen,
    user, userData,
    dailyGoal, timeSpent, setTimeSpent,
    userName, handleLogout,
    isMaintenanceMode,
  } = useAppContext();

  const navigate = useNavigate();
  const [showGoalReachedPopup, setShowGoalReachedPopup] = useState(false);
  const dailyGoalAchievedRef = useRef(false);
  const intervalRef = useRef(null);

  const handleGoHomeOnError = () => {
    navigate('/');
    window.location.reload();
  };

  // الكود الخاص بالـ timers والـ service worker يبقى كما هو (بدون تغيير)
  useEffect(() => {
    PWANotificationService.requestPermission();
    PWANotificationService.scheduleStudyReminder();
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    
    dailyGoalAchievedRef.current = localStorage.getItem('dailyGoalAchievedDate') === today;
    
    if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }
    
    if (!timeSpent || timeSpent.date !== today) {
        setTimeSpent({ time: 0, date: today });
        dailyGoalAchievedRef.current = false;
        localStorage.removeItem('dailyGoalAchievedDate');
    }
    
    intervalRef.current = setInterval(() => {
        if ((typeof document !== 'undefined' && document.hidden) || dailyGoalAchievedRef.current) {
            return;
        }
        
        setTimeSpent(prev => {
            const currentTime = prev ? prev.time : 0;
            const newTime = currentTime + 10;
            
            const currentDailyGoal = JSON.parse(localStorage.getItem('stellarSpeakDailyGoal')) || 10;
            
            if (newTime >= currentDailyGoal * 60) {
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
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  if (isMaintenanceMode && !userData?.isAdmin) {
    return <MaintenanceScreen />;
  }

  return (
    <HelmetProvider>
      <SEO />
      <NetworkStatus />
      <PWAUpdate />
      <InstallPrompt />
      
      <ErrorBoundary isDarkMode={isDarkMode} onGoHome={handleGoHomeOnError} showHomeButton={true} title="خطأ جسيم في التطبيق" message="حدث خطأ غير متوقع أدى إلى توقف التطبيق. سيتم إعادتك إلى الصفحة الرئيسية.">
        {/* الهيكل الدائم للتطبيق */}
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
          <InteractiveErrorBoundary isDarkMode={isDarkMode}><Header /></InteractiveErrorBoundary>

          {/* المحتوى المتغير يتم عرضه هنا */}
          <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8 flex-grow flex flex-col">
            <MainContent />
          </main>
          
          {/* المودالات والفوتر */}
          <InteractiveErrorBoundary isDarkMode={isDarkMode}>
            <AnnouncementModal />
            <AchievementPopup />
            <ExamPrompt />
            <LevelPrompt />
            <RegisterPrompt />
            <MoreMenu />

            {showGoalReachedPopup && (<GoalReachedPopup dailyGoal={dailyGoal} onClose={() => setShowGoalReachedPopup(false)}/>)}
            
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

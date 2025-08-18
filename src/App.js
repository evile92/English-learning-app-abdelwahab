import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Feather, Sun, Moon, Search, Library, Mic, Voicemail, History, LogOut, LogIn, User, Heart, X, Grid } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";

// Import Components
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
import Certificate from './components/Certificate';
import StellarSpeakLogo from './components/StellarSpeakLogo';
import Login from './components/Login';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import ProfileModal from './components/ProfileModal';

// Import Data
import { initialLevels, initialLessonsData } from './data/lessons';

function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage", error);
        }
    }, [key, state]);

    return [state, setState];
}

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authStatus, setAuthStatus] = useState('loading');
  const [isSyncing, setIsSyncing] = useState(true);

  const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', null);
  const [userName, setUserName] = usePersistentState('stellarSpeakUserName', '');
  const [lessonsDataState, setLessonsDataState] = usePersistentState('stellarSpeakLessonsData', initialLessonsData);
  const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);

  const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
  const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
  const [certificateToShow, setCertificateToShow] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const fetchUserData = useCallback(async (currentUser) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        if (data.lessonsData) setLessonsDataState(data.lessonsData);
        if (data.level) setUserLevel(data.level);
      }
    } else {
      setUserData(null);
    }
  }, [setLessonsDataState, setUserLevel]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser);
      }
      setAuthStatus('idle');
      setIsSyncing(false);
    });
    return () => unsubscribe();
  }, [fetchUserData]);

  // --- (بداية الحل البديل: الحفظ التلقائي في الخلفية) ---
  const isInitialMount = useRef(true);
  useEffect(() => {
      // تخطي التشغيل الأول عند تحميل الصفحة لتجنب الحفظ غير الضروري
      if (isInitialMount.current) {
          isInitialMount.current = false;
          return;
      }
      
      // إذا كان هناك مستخدم مسجل، قم بحفظ التقدم في الخلفية
      if (user) {
          const saveData = async () => {
              try {
                  const userDocRef = doc(db, "users", user.uid);
                  await updateDoc(userDocRef, {
                      lessonsData: lessonsDataState
                  });
              } catch (error) {
                  console.error("Auto-save failed:", error);
              }
          };
          saveData();
      }
  }, [lessonsDataState, user]); // يتم تشغيل هذا التأثير فقط عند تغيير بيانات الدروس
  // --- (نهاية الحل البديل) ---

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleLogout = async () => {
    await signOut(auth);
    Object.keys(window.localStorage).forEach(key => {
        if (key.startsWith('stellarSpeak')) {
            window.localStorage.removeItem(key);
        }
    });
    setPage('welcome');
    setUserLevel(null);
    setLessonsDataState(initialLessonsData);
    setUserName('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    
    // الخطوة 1: تحديث الحالة المحلية فقط
    const updatedLessonsData = {
        ...lessonsDataState,
        [levelId]: lessonsDataState[levelId].map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true, stars: Math.max(1, Math.round((score / total) * 3)) } : lesson
        )
    };
    setLessonsDataState(updatedLessonsData);

    // الخطوة 2: التحقق من اكتمال المستوى (محلياً)
    const isLevelComplete = updatedLessonsData[levelId].every(lesson => lesson.completed);
    if (isLevelComplete && user) {
        const userDocRef = doc(db, "users", user.uid);
        const currentDBData = (await getDoc(userDocRef)).data();
        const hasCertificate = currentDBData.earnedCertificates?.includes(levelId);

        if (!hasCertificate) {
            setCertificateToShow(levelId); // عرض الشهادة
            
            const levelKeys = Object.keys(initialLevels);
            const currentLevelIndex = levelKeys.indexOf(levelId);
            const nextLevelIndex = currentLevelIndex + 1;
            
            const updates = { earnedCertificates: arrayUnion(levelId) };
            if (nextLevelIndex < levelKeys.length) {
                const nextLevel = levelKeys[nextLevelIndex];
                updates.level = nextLevel;
                setUserLevel(nextLevel);
            }
            await updateDoc(userDocRef, updates);
        }
    }
    
    // الخطوة 3: تحديث النقاط (وهي عملية منفصلة وآمنة)
    if (user) {
        await updateDoc(doc(db, "users", user.uid), {
            points: increment(score * 10)
        });
    }

    // الخطوة 4: العودة إلى قائمة الدروس
    setPage('lessons');

  }, [user, lessonsDataState, setLessonsDataState, setUserLevel]);

  const handleCertificateDownload = () => { 
    setCertificateToShow(null);
    handlePageChange('dashboard');
  };

  const viewCertificate = (levelId) => {
    setCertificateToShow(levelId);
  };

  const handleTestComplete = (level) => { setUserLevel(level); setPage('nameEntry'); };
  const handleNameSubmit = (name) => { setUserName(name); setPage('dashboard'); };
  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setPage('dashboard'); };
  const handleBackToLessons = () => { setPage('lessons'); };

  if (authStatus === 'loading' || isSyncing) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <StellarSpeakLogo />
      </div>
    );
  }

  const renderPage = () => {
    if (!user && !userLevel) {
        if(page === 'welcome') return <WelcomeScreen onStart={() => setPage('test')} />;
        if(page === 'test') return <PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />;
        if(page === 'nameEntry') return <NameEntryScreen onNameSubmit={handleNameSubmit} />;
    }

    if (page === 'login') {
        if (user) { setPage('dashboard'); return null; }
        return <Login onRegisterClick={() => setPage('register')} />;
    }
    if (page === 'register') {
        if (user) { setPage('dashboard'); return null; }
        return <Register onLoginClick={() => setPage('login')} />;
    }

    if (certificateToShow) { return <Certificate levelId={certificateToShow} userName={userName || user?.displayName} onDownload={handleCertificateDownload} initialLevels={initialLevels} /> }
    
    if (page === 'profile') {
        return <ProfilePage userData={userData} lessonsData={lessonsDataState} initialLevels={initialLevels} onViewCertificate={viewCertificate} />;
    }

    switch (page) {
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
      case 'lessons': 
        if (!selectedLevelId) { handleBackToDashboard(); return null; } 
        return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessonsDataState[selectedLevelId] || []} initialLevels={initialLevels} />;
      case 'lessonContent': 
        if (!currentLesson) { handleBackToLessons(); return null; } 
        return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />;
      // ... باقي الحالات
      default: return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
    }
  };

  return (
    // ... باقي الكود يبقى كما هو ...
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        <header>
            {/* ... الهيدر يبقى كما هو ... */}
        </header>
        <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8">
            {renderPage()}
        </main>
        {/* ... الفوتر والقوائم المنبثقة تبقى كما هي ... */}
      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </>
  );
}

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Feather, Sun, Moon, Search, Library, Mic, Voicemail, History, LogOut, LogIn, User } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

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

// Import Data
import { initialLevels, initialLessonsData } from './data/lessons';

// Custom Hook for persistent state
function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue !== null) {
                return JSON.parse(storedValue);
            }
            return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
        } catch (error) {
            console.error("Error reading from localStorage", error);
            return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
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

  const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', null);
  const [userName, setUserName] = usePersistentState('stellarSpeakUserName', '');
  const [lessonsDataState, setLessonsDataState] = usePersistentState('stellarSpeakLessonsData', () => initialLessonsData);
  const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);

  const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
  const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
  const [certificateToShow, setCertificateToShow] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const allLessons = useRef(Object.values(initialLessonsData).flat());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        setUserData(null);
      }
      setAuthStatus('idle');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const today = new Date().toDateString();
    if (streakData.lastVisit !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (streakData.lastVisit === yesterday.toDateString()) {
            setStreakData(prev => ({ count: prev.count + 1, lastVisit: today }));
        } else {
            setStreakData({ count: 1, lastVisit: today });
        }
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
    }
    const filteredLessons = allLessons.current.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredLessons);
  }, [searchQuery]);

  const handleLogout = async () => {
    await signOut(auth);
    setPage('welcome');
  };

  const handleSearchSelect = (lesson) => {
    setCurrentLesson(lesson);
    setPage('lessonContent');
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  // --- (هذا هو الكود المصحح والنهائي الذي يحل المشكلة) ---
  const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
    const pointsEarned = score * 10;
    const stars = Math.max(1, Math.round((score / total) * 3));
    const levelId = lessonId.substring(0, 2);

    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            points: increment(pointsEarned)
        });
        setUserData(prev => ({ ...prev, points: (prev?.points || 0) + pointsEarned }));
    }
    
    // استخدام دالة التحديث الوظيفية لضمان أننا نعمل على أحدث حالة
    setLessonsDataState(currentLessonsData => {
        // 1. حساب البيانات المحدثة بناءً على الحالة الحالية
        const updatedLessons = currentLessonsData[levelId].map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
        );
        const newLessonsData = { ...currentLessonsData, [levelId]: updatedLessons };
        
        // 2. التحقق من اكتمال المستوى باستخدام البيانات المحدثة التي حسبناها للتو
        const isLevelComplete = updatedLessons.every(lesson => lesson.completed);
        
        // 3. اتخاذ القرار الصحيح بالانتقال
        if (isLevelComplete) {
            setCertificateToShow(levelId);
            const levelKeys = Object.keys(initialLevels);
            const currentLevelIndex = levelKeys.indexOf(levelId);
            if (currentLevelIndex < levelKeys.length - 1) {
                setUserLevel(levelKeys[currentLevelIndex + 1]);
            }
        } else {
            setPage('lessons');
        }
        
        // 4. إرجاع البيانات الجديدة لتحديث الحالة
        return newLessonsData;
    });

  }, [user]); // الاعتماديات الصحيحة للدالة
  // --- (نهاية الكود المصحح) ---

  const handleTestComplete = (level) => { setUserLevel(level); setPage('nameEntry'); };
  const handleNameSubmit = (name) => { setUserName(name); setPage('dashboard'); };
  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setPage('dashboard'); };
  const handleBackToLessons = () => { setPage('lessons'); };
  const handleCertificateDownload = () => { setCertificateToShow(null); handleBackToDashboard(); };

  if (authStatus === 'loading') {
    return <div className="flex justify-center items-center h-screen"><StellarSpeakLogo /></div>;
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
        return <ProfilePage userData={userData} lessonsData={lessonsDataState} initialLevels={initialLevels} />;
    }

    if (page === 'search') {
      return (
          <div className="p-4 md:p-8 animate-fade-in z-10 relative">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text"
                    placeholder="ابحث عن أي درس..."
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white dark:bg-slate-800 w-full rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-sky-500 border dark:border-slate-700"
                />
              </div>
              {searchQuery.trim() !== '' && 
                  <div className="mt-4 max-w-lg mx-auto bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border dark:border-slate-700 max-h-[60vh] overflow-y-auto">
                      {searchResults.length > 0 ? searchResults.map(lesson => (
                          <div key={lesson.id} onClick={() => handleSearchSelect(lesson)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer border-b dark:border-slate-700">
                              <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">المستوى: {lesson.id.substring(0,2)}</p>
                          </div>
                      )) : <p className="p-4 text-center text-slate-500">لا توجد نتائج بحث...</p>}
                  </div>
              }
          </div>
      );
    }

    switch (page) {
      case 'dashboard': return <Dashboard userLevel={userLevel || userData?.level} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
      case 'lessons': if (!selectedLevelId) { handleBackToDashboard(); return null; } return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessonsDataState[selectedLevelId] || []} initialLevels={initialLevels} />;
      case 'lessonContent': if (!currentLesson) { handleBackToLessons(); return null; } return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />;
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'roleplay': return <RolePlaySection />;
      case 'pronunciation': return <PronunciationCoach />;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} />;
      default: return <Dashboard userLevel={userLevel || userData?.level} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
    }
  };
  
  const navItems = [ 
    { id: 'dashboard', label: 'المجرة', icon: BookOpen }, 
    { id: 'profile', label: 'ملفي', icon: User },
    { id: 'search', label: 'بحث', icon: Search },
    { id: 'writing', label: 'كتابة', icon: Feather }, 
    { id: 'reading', label: 'قراءة', icon: Library }, 
    { id: 'roleplay', label: 'محادثة', icon: Mic }, 
    { id: 'pronunciation', label: 'نطق', icon: Voicemail }, 
    { id: 'review', label: 'مراجعة', icon: History }, 
  ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        <header className={`sticky top-0 z-30 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageChange('dashboard')}> 
              <StellarSpeakLogo /> 
              <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user && user.displayName ? `أهلاً، ${user.displayName}` : userName ? `أهلاً، ${userName}`: 'Stellar Speak'}</span> 
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>))}
            </div>

            <div className="flex items-center gap-2">
                <a 
                  href="https://paypal.me/ABDELOUAHABELKOUCH" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-amber-400 to-orange-500 text-white font-semibold flex items-center gap-2 px-3 py-2 rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/50 text-sm"
                >
                  ادعمنا 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </a>
                {user ? (
                    <button onClick={handleLogout} title="تسجيل الخروج" className="p-2 rounded-full transition-colors hover:bg-red-500/20 text-red-500"><LogOut size={20} /></button>
                ) : (
                    <button onClick={() => setPage('login')} title="تسجيل الدخول" className="p-2 rounded-full transition-colors hover:bg-sky-500/20 text-sky-500"><LogIn size={20} /></button>
                )}
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}> 
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                </button> 
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>
        {userLevel && (
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex justify-around items-center"> 
            {navItems.map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-16 ${ page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}> <item.icon size={22} /> <span className="text-xs font-medium">{item.label}</span> </button> ))} 
          </div>
        </footer>
        )}
      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } `}</style>
    </>
  );
}

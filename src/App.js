import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, Feather, Sun, Moon, Search, Library, Mic, Voicemail, History, LogOut, LogIn, User, Heart } from 'lucide-react';
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
  
  const isInitialMount = useRef(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const allLessons = useRef(Object.values(initialLessonsData).flat());

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);


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
    function handleClickOutside(event) {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
            setIsProfileMenuOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

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
  
  useEffect(() => {
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    if (page === 'lessons' && selectedLevelId && lessonsDataState[selectedLevelId]) {
        const currentLevelLessons = lessonsDataState[selectedLevelId];
        const isLevelComplete = currentLevelLessons.every(lesson => lesson.completed);

        if (isLevelComplete) {
            setCertificateToShow(selectedLevelId);
            const levelKeys = Object.keys(initialLevels);
            const currentLevelIndex = levelKeys.indexOf(selectedLevelId);
            if (currentLevelIndex < levelKeys.length - 1) {
                setUserLevel(levelKeys[currentLevelIndex + 1]);
            }
        }
    }
  }, [page, lessonsDataState, selectedLevelId, setUserLevel]);


  const handleLogout = async () => {
    await signOut(auth);
    setIsProfileMenuOpen(false);
    setPage('welcome');
  };

  const handleSearchSelect = (lesson) => {
    setCurrentLesson(lesson);
    setPage('lessonContent');
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setIsProfileMenuOpen(false);
  };
  
  const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    setPage('lessons');

    const pointsEarned = score * 10;
    const stars = Math.max(1, Math.round((score / total) * 3));

    setLessonsDataState(currentLessonsData => {
        const updatedLessons = currentLessonsData[levelId].map(lesson =>
            lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
        );
        return { ...currentLessonsData, [levelId]: updatedLessons };
    });

    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { points: increment(pointsEarned) });
        setUserData(prev => ({ ...prev, points: (prev?.points || 0) + pointsEarned }));
    }
  }, [user, setLessonsDataState]);

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
    { id: 'writing', label: 'كتابة', icon: Feather }, 
    { id: 'reading', label: 'قراءة', icon: Library }, 
    { id: 'roleplay', label: 'محادثة', icon: Mic }, 
    { id: 'pronunciation', label: 'نطق', icon: Voicemail }, 
    { id: 'review', label: 'مراجعة', icon: History }, 
    { id: 'profile', label: 'ملفي', icon: User },
    { id: 'search', label: 'بحث', icon: Search },
  ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        
        {/* --- Header Section --- */}
        <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            {/* Left Side: Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handlePageChange('dashboard')}> 
              <StellarSpeakLogo /> 
              <span className={`hidden sm:block text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span> 
            </div>
            
            {/* Middle (Desktop): Main Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navItems.slice(0, 6).map(item => (
                  <button key={item.id} onClick={() => handlePageChange(item.id)} title={item.label} className={`flex items-center gap-2 font-semibold transition-colors ${page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}>
                      <item.icon size={20} />
                      <span>{item.label}</span>
                  </button>
              ))}
            </div>

            {/* Right Side: Profile Menu */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
              >
                <User size={20} />
              </button>

              {/* --- THE FIX for the Dropdown Menu --- */}
              {isProfileMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl animate-fade-in-fast overflow-hidden z-50">
                  {/* Menu Content... */}
                  {user ? (
                    <div>
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-800 dark:text-white truncate">{user.displayName || userName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <button onClick={() => handlePageChange('profile')} className="w-full text-right flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <User size={18}/> ملفي الشخصي
                        </button>
                        <button onClick={() => handlePageChange('search')} className="w-full text-right flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Search size={18}/> بحث
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-800 dark:text-white">أهلاً بك</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">سجل الدخول للمتابعة</p>
                    </div>
                  )}
                  
                  <div className="py-2 border-t border-slate-200 dark:border-slate-700">
                    <a href="https://paypal.me/ABDELOUAHABELKOUCH" target="_blank" rel="noopener noreferrer" className="w-full text-right flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      <Heart size={18} className="text-red-500"/> ادعمنا
                    </a>
                    <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full text-right flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
                        {isDarkMode ? 'الوضع المضيء' : 'الوضع الداكن'}
                    </button>
                  </div>

                  <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                    {user ? (
                        <button onClick={handleLogout} className="w-full text-right flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md">
                            <LogOut size={18}/> تسجيل الخروج
                        </button>
                    ) : (
                        <button onClick={() => handlePageChange('login')} className="w-full text-right flex items-center gap-3 px-3 py-2 text-green-500 hover:bg-green-500/10 rounded-md">
                            <LogIn size={18}/> تسجيل الدخول
                        </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>

        {userLevel && (
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="grid grid-cols-4 gap-2"> 
            {navItems.map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-full ${ page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}> <item.icon size={22} /> <span className="text-xs font-medium">{item.label}</span> </button> ))} 
          </div>
        </footer>
        )}

      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } .animate-fade-in-fast { animation: fadeIn 0.1s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } } `}</style>
    </>
  );
}

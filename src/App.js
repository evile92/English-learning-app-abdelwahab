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
  const [isSyncing, setIsSyncing] = useState(true);

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

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const fetchUserData = useCallback(async (currentUser) => {
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        if (data.lessonsData) {
            setLessonsDataState(data.lessonsData);
        }
        if (data.level) {
            setUserLevel(data.level);
        }
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
  }, [streakData, setStreakData]);

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
  

  // --- (بداية التعديل: تنظيف الذاكرة المحلية عند تسجيل الخروج) ---
  const handleLogout = async () => {
    await signOut(auth);
    // مسح المفاتيح من الذاكرة المحلية بشكل صريح لضمان عدم تداخل البيانات
    window.localStorage.removeItem('stellarSpeakPage');
    window.localStorage.removeItem('stellarSpeakUserLevel');
    window.localStorage.removeItem('stellarSpeakUserName');
    window.localStorage.removeItem('stellarSpeakLessonsData');
    window.localStorage.removeItem('stellarSpeakSelectedLevelId');
    window.localStorage.removeItem('stellarSpeakCurrentLesson');
    // إعادة تعيين الحالات إلى القيم الافتراضية
    setPage('welcome');
    setUserLevel(null);
    setLessonsDataState(initialLessonsData);
    setUserName('');
  };
  // --- (نهاية التعديل) ---

  const handleSearchSelect = (lesson) => {
    setCurrentLesson(lesson);
    setPage('lessonContent');
    setSearchQuery('');
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleCompleteLesson = useCallback(async (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    const pointsEarned = score * 10;
    const stars = Math.max(1, Math.round((score / total) * 3));

    const updatedLessonsData = { ...lessonsDataState };
    const levelLessons = updatedLessonsData[levelId].map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
    );
    updatedLessonsData[levelId] = levelLessons;
    setLessonsDataState(updatedLessonsData);

    const isLevelComplete = levelLessons.every(lesson => lesson.completed);
    
    if (isLevelComplete) {
      const levelKeys = Object.keys(initialLevels);
      const currentLevelIndex = levelKeys.indexOf(levelId);
      const nextLevelIndex = currentLevelIndex + 1;

      if (nextLevelIndex < levelKeys.length && levelKeys.indexOf(userLevel) <= currentLevelIndex) {
        const nextLevel = levelKeys[nextLevelIndex];
        setUserLevel(nextLevel);
        if (user) {
          await updateDoc(doc(db, "users", user.uid), { level: nextLevel });
        }
      }
      
      const hasCertificate = userData?.earnedCertificates?.includes(levelId);
      if (!hasCertificate) {
        setCertificateToShow(levelId);
        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            earnedCertificates: arrayUnion(levelId)
          });
        }
      }
    }
    
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        points: increment(pointsEarned),
        lessonsData: updatedLessonsData
      });
      await fetchUserData(user);
    }
  }, [lessonsDataState, user, userData, userLevel, setLessonsDataState, setUserLevel, fetchUserData]);

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
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
      case 'lessons': 
        if (!selectedLevelId) { handleBackToDashboard(); return null; } 
        return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessonsDataState[selectedLevelId] || []} initialLevels={initialLevels} />;
      case 'lessonContent': 
        if (!currentLesson) { handleBackToLessons(); return null; } 
        return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={(data) => { handleCompleteLesson(data.lessonId, data.score, data.total); handleBackToLessons(); }} />;
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'roleplay': return <RolePlaySection />;
      case 'pronunciation': return <PronunciationCoach />;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} />;
      default: return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
    }
  };
  
  const mobileBottomNavItems = [
    { id: 'dashboard', label: 'المجرة', icon: BookOpen },
    { id: 'review', label: 'مراجعة', icon: History },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'more', label: 'المزيد', icon: Grid },
  ];
  
  const moreMenuItems = [
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'pronunciation', label: 'نطق', icon: Voicemail },
    { id: 'search', label: 'بحث', icon: Search },
    { id: 'profile', label: 'ملفي', icon: User },
  ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        
        <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handlePageChange('dashboard')}> 
                        <StellarSpeakLogo /> 
                        <span className={`hidden sm:block text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span> 
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {/* Desktop nav can be populated here if needed */}
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <a 
                           href="https://paypal.me/ABDELOUAHABELKOUCH" 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                        >
                            <Heart size={16} />
                            <span className="hidden sm:inline">ادعمنا</span>
                        </a>

                        <button 
                            onClick={() => setIsProfileModalOpen(true)}
                            className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full hover:ring-2 hover:ring-sky-500 transition-all"
                        >
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-8 pb-28 md:pb-8">
            {renderPage()}
        </main>
        
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
        
        {isMoreMenuOpen && (
            <div 
                onClick={() => setIsMoreMenuOpen(false)}
                className="md:hidden fixed inset-0 bg-black/40 z-40 animate-fade-in-fast"
            >
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className={`fixed bottom-0 left-0 right-0 p-4 pb-20 rounded-t-2xl shadow-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">جميع الميزات</h3>
                        <button onClick={() => setIsMoreMenuOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {moreMenuItems.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => { handlePageChange(item.id); setIsMoreMenuOpen(false); }}
                                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <item.icon size={24} className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} />
                                <span className="text-sm font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {userLevel && (
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 z-30 border-t ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-around items-center h-16"> 
            {mobileBottomNavItems.map(item => ( 
              <button 
                key={item.id} 
                onClick={() => item.id === 'more' ? setIsMoreMenuOpen(true) : handlePageChange(item.id)} 
                className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${ 
                  page === item.id || (item.id === 'more' && isMoreMenuOpen)
                  ? (isDarkMode ? 'text-sky-400' : 'text-sky-600') 
                  : (isDarkMode ? 'text-slate-400' : 'text-slate-500')
                }`}
              > 
                <div className={`p-2 rounded-full ${(page === item.id || (item.id === 'more' && isMoreMenuOpen)) ? (isDarkMode ? 'bg-sky-400/10' : 'bg-sky-100') : ''}`}>
                  <item.icon size={20} /> 
                </div>
                <span className="text-xs font-medium">{item.label}</span> 
              </button> 
            ))} 
          </div>
        </footer>
        )}

      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } .animate-fade-in-fast { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } `}</style>
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Sun, Moon, Search, Library, Mic, Voicemail, History, LogOut } from 'lucide-react';
import { auth } from './firebase'; // <-- 1. استيراد أداة المصادقة
import { onAuthStateChanged, signOut } from "firebase/auth";

// استيراد المكونات من ملفاتها الجديدة
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
import Login from './components/Login'; // <-- 2. استيراد المكونات الجديدة
import Register from './components/Register'; // <-- 2. استيراد المكونات الجديدة

// استيراد البيانات
import { initialLevels, initialLessonsData } from './data/lessons';

// Custom Hook لتخزين البيانات
function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue) {
                return JSON.parse(storedValue);
            }
        } catch (error) { console.error("Error reading from localStorage", error); }
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) { console.error("Error writing to localStorage", error); }
    }, [key, state]);

    return [state, setState];
}

// المكون الرئيسي للتطبيق
export default function App() {
  // --- 3. حالات جديدة لإدارة المستخدم والتسجيل ---
  const [user, setUser] = useState(null); // لتخزين معلومات المستخدم المسجل
  const [authStatus, setAuthStatus] = useState('loading'); // loading, signedIn, signedOut
  const [authPage, setAuthPage] = useState('login'); // login or register

  const [page, setPage] = usePersistentState('stellarSpeakPage', 'dashboard');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', 'A1');
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
  
  // --- 4. التأثير السحري: الاستماع لحالة تسجيل الدخول ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // المستخدم سجل دخوله
        setUser(currentUser);
        setAuthStatus('signedIn');
      } else {
        // المستخدم سجل خروجه
        setUser(null);
        setAuthStatus('signedOut');
      }
    });
    // التنظيف عند إغلاق التطبيق
    return () => unsubscribe();
  }, []);


  useEffect(() => { if (isDarkMode) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } }, [isDarkMode]);

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
    // مسح البيانات المحلية عند تسجيل الخروج (اختياري)
    window.localStorage.removeItem('stellarSpeakPage');
    window.localStorage.removeItem('stellarSpeakUserLevel');
    window.localStorage.removeItem('stellarSpeakUserName');
  };
  
  // ... بقية الدوال (handlers) كما هي ...
  const handleSearchSelect = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); setSearchQuery(''); };
  const handlePageChange = (newPage) => { setPage(newPage); };
  const handleCompleteLesson = (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    const stars = Math.max(1, Math.round((score / total) * 3));
    setLessonsDataState(prevData => {
        const updatedLessons = prevData[levelId].map(lesson => lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson );
        const newLessonsData = { ...prevData, [levelId]: updatedLessons };
        const isLevelComplete = updatedLessons.every(lesson => lesson.completed);
        if (isLevelComplete) {
            setCertificateToShow(levelId);
            const levelKeys = Object.keys(initialLevels);
            const currentLevelIndex = levelKeys.indexOf(levelId);
            if (currentLevelIndex < levelKeys.length - 1) {
                setUserLevel(levelKeys[currentLevelIndex + 1]);
            }
        }
        return newLessonsData;
    });
    if (!certificateToShow) { handleBackToLessons(); }
  };
  const handleTestComplete = (level) => { setUserLevel(level); setPage('nameEntry'); };
  const handleNameSubmit = (name) => { setUserName(name); setPage('dashboard'); };
  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setSelectedLevelId(null); setCurrentLesson(null); setPage('dashboard'); }
  const handleBackToLessons = () => { setCurrentLesson(null); setPage('lessons'); }
  const handleCertificateDownload = () => { setCertificateToShow(null); handleBackToDashboard(); }
  
  // --- 5. منطق العرض الجديد ---
  const renderContent = () => {
    if (authStatus === 'loading') {
      return <div className="flex justify-center items-center h-screen"><StellarSpeakLogo /></div>;
    }
    
    if (authStatus === 'signedOut') {
        if(authPage === 'login'){
            return <Login onRegisterClick={() => setAuthPage('register')} />;
        }
        return <Register onLoginClick={() => setAuthPage('login')} />;
    }

    // إذا كان المستخدم قد سجل دخوله (signedIn)
    if (certificateToShow) { return <Certificate levelId={certificateToShow} userName={userName} onDownload={handleCertificateDownload} initialLevels={initialLevels} /> }
    
    // أول مرة بعد التسجيل؟ اعرض شاشة الترحيب ثم الاختبار ثم إدخال الاسم
    if (!userName) {
        if(page === 'welcome') return <WelcomeScreen onStart={() => setPage('test')} />;
        if(page === 'test') return <PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />;
        if(page === 'nameEntry') return <NameEntryScreen onNameSubmit={handleNameSubmit} />;
    }
    
    switch (page) {
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
      case 'lessons': { if (!selectedLevelId || !lessonsDataState[selectedLevelId]) { handleBackToDashboard(); return null; } const lessons = lessonsDataState[selectedLevelId] || []; return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessons} initialLevels={initialLevels} />; }
      case 'lessonContent': { if (!currentLesson) { handleBackToLessons(); return null; } return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />; }
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'roleplay': return <RolePlaySection />;
      case 'pronunciation': return <PronunciationCoach />;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} />;
      case 'search': return ( /* ... كود البحث كما هو ... */ );
      default: return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
    }
  };

  const navItems = [ 
    { id: 'dashboard', label: 'المجرة', icon: BookOpen }, 
    { id: 'writing', label: 'كتابة', icon: Feather }, 
    { id: 'search', label: 'بحث', icon: Search },
    { id: 'reading', label: 'قراءة', icon: Library }, 
    { id: 'roleplay', label: 'محادثة', icon: Mic }, 
    { id: 'pronunciation', label: 'نطق', icon: Voicemail }, 
    { id: 'review', label: 'مراجعة', icon: History }, 
  ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        {authStatus === 'signedIn' && ( // لا تظهر الشريط العلوي والسفلي إلا إذا سجل المستخدم دخوله
        <header className={`sticky top-0 z-30 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageChange('dashboard')}> <StellarSpeakLogo /> <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{userName ? `أهلاً، ${userName}` : 'Stellar Speak'}</span> </div>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>))}
            </div>

            <div className="flex items-center gap-2">
                <button onClick={handleLogout} className="p-2 rounded-full transition-colors hover:bg-red-500/20 text-red-500"><LogOut size={20} /></button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}> 
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                </button> 
            </div>
          </nav>
        </header>
        )}
        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderContent()}</main>
        {authStatus === 'signedIn' && (
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

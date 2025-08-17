import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Sun, Moon, Search, Library, Mic, Voicemail, History } from 'lucide-react';

// استيراد المكونات من ملفاتها الجديدة في مجلد "components"
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

// استيراد البيانات من ملفها الجديد في مجلد "data"
import { initialLevels, initialLessonsData } from './data/lessons';

// Custom Hook لتخزين البيانات في المتصفح
function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue) {
                return JSON.parse(storedValue);
            }
        } catch (error) {
            console.error("Error reading from localStorage", error);
        }
        return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
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

// المكون الرئيسي للتطبيق
export default function App() {
  const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', 'A1');
  const [userName, setUserName] = usePersistentState('stellarSpeakUserName', '');
  const [lessonsDataState, setLessonsDataState] = usePersistentState('stellarSpeakLessonsData', () => initialLessonsData);
  const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
  
  const [selectedLevelId, setSelectedLevelId] = usePersistentState('stellarSpeakSelectedLevelId', null);
  const [currentLesson, setCurrentLesson] = usePersistentState('stellarSpeakCurrentLesson', null);
  const [certificateToShow, setCertificateToShow] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const allLessons = useRef(Object.values(initialLessonsData).flat());
  
  useEffect(() => {
    const today = new Date().toDateString();
    if (streakData.lastVisit !== today) { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (streakData.lastVisit === yesterday.toDateString()) { setStreakData(prev => ({ count: prev.count + 1, lastVisit: today })); } else { setStreakData({ count: 1, lastVisit: today }); } }
    setTimeout(() => setIsInitialLoad(false), 50); 
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
  
  const handleSearchSelect = (lesson) => {
    setCurrentLesson(lesson);
    setPage('lessonContent');
    setSearchQuery('');
  };
  
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCompleteLesson = (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    const stars = Math.max(1, Math.round((score / total) * 3));
    let updatedLessons;
    let newLessonsData;

    setLessonsDataState(prevData => {
        updatedLessons = prevData[levelId].map(lesson => lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson );
        newLessonsData = { ...prevData, [levelId]: updatedLessons };
        return newLessonsData;
    });

    const isLevelComplete = updatedLessons.every(lesson => lesson.completed);
    if (isLevelComplete) {
        setCertificateToShow(levelId);
        
        const levelKeys = Object.keys(initialLevels);
        const currentLevelIndex = levelKeys.indexOf(levelId);
        if (currentLevelIndex < levelKeys.length - 1) {
            setUserLevel(levelKeys[currentLevelIndex + 1]);
        }
    } else {
        handleBackToLessons();
    }
  };
  
  const handleTestComplete = (level) => {
    setUserLevel(level);
    setPage('nameEntry');
  };

  const handleNameSubmit = (name) => {
    setUserName(name);
    setPage('dashboard');
  };

  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setSelectedLevelId(null); setCurrentLesson(null); setPage('dashboard'); }
  const handleBackToLessons = () => { setCurrentLesson(null); setPage('lessons'); }
  const handleCertificateDownload = () => { setCertificateToShow(null); handleBackToDashboard(); }
  
  if (isInitialLoad) { return ( <div className="fixed inset-0 bg-slate-900 flex items-center justify-center"><div className="animate-spin"><StellarSpeakLogo /></div></div> ); }

  const renderPage = () => {
    if (certificateToShow) { return <Certificate levelId={certificateToShow} userName={userName} onDownload={handleCertificateDownload} initialLevels={initialLevels} /> }
    
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
      case 'welcome': return <WelcomeScreen onStart={() => setPage('test')} />;
      case 'test': return <PlacementTest onTestComplete={handleTestComplete} initialLevels={initialLevels} />;
      case 'nameEntry': return <NameEntryScreen onNameSubmit={handleNameSubmit} />;
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} initialLevels={initialLevels} />;
      case 'lessons': { if (!selectedLevelId || !lessonsDataState[selectedLevelId]) { handleBackToDashboard(); return null; } const lessons = lessonsDataState[selectedLevelId] || []; return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessons} initialLevels={initialLevels} />; }
      case 'lessonContent': { if (!currentLesson) { handleBackToLessons(); return null; } return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />; }
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'roleplay': return <RolePlaySection />;
      case 'pronunciation': return <PronunciationCoach />;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} />;
      default: return <WelcomeScreen onStart={() => setPage('dashboard')} />;
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
        <header className={`sticky top-0 z-30 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handlePageChange('dashboard')}> <StellarSpeakLogo /> <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span> </div>
            
            <div className="hidden md:flex items-center gap-6">
              {navItems.filter(i => i.id !== 'search').map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 dark:text-sky-400' : page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>))}
              <button onClick={() => handlePageChange('search')} className={`flex items-center gap-2 p-2 rounded-full transition-colors ${page === 'search' ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>
                <Search size={20} />
              </button>
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
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}> 
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                </button> 
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>

        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex justify-around items-center"> 
            {navItems.map(item => ( <button key={item.id} onClick={() => handlePageChange(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-16 ${ page.startsWith('lesson') && item.id === 'dashboard' ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}> <item.icon size={22} /> <span className="text-xs font-medium">{item.label}</span> </button> ))} 
          </div>
        </footer>
      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } `}</style>
    </>
  );
}

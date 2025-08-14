import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Award, Sun, Moon, FileText, Download, MessageSquare, BrainCircuit, Library, Sparkles, Wand2, ArrowLeft, CheckCircle, LoaderCircle, XCircle, RefreshCw, Mic, Voicemail, Star, History, ShoppingCart, Users, Newspaper, Flame } from 'lucide-react';

// --- بيانات التطبيق ---
const initialLevels = {
  A1: { name: "المياه الضحلة", icon: "A1", lessons: 30, color: "from-cyan-400 to-sky-500" },
  A2: { name: "الشعاب المرجانية", icon: "A2", lessons: 30, color: "from-teal-400 to-emerald-500" },
  B1: { name: "المدينة الغارقة", icon: "B1", lessons: 30, color: "from-amber-400 to-yellow-500" },
  B2: { name: "الأعماق السحيقة", icon: "B2", lessons: 30, color: "from-orange-500 to-red-500" },
  C1: { name: "خندق ماريانا", icon: "C1", lessons: 30, color: "from-indigo-500 to-purple-600" },
};

const initialLessonsData = {
    A1: Array.from({ length: 30 }, (_, i) => ({ id: `A1-${i + 1}`, title: `A1 Lesson ${i + 1}`, completed: false, stars: 0 })),
    A2: Array.from({ length: 30 }, (_, i) => ({ id: `A2-${i + 1}`, title: `A2 Lesson ${i + 1}`, completed: false, stars: 0 })),
    B1: Array.from({ length: 30 }, (_, i) => ({ id: `B1-${i + 1}`, title: `B1 Lesson ${i + 1}`, completed: false, stars: 0 })),
    B2: Array.from({ length: 30 }, (_, i) => ({ id: `B2-${i + 1}`, title: `B2 Lesson ${i + 1}`, completed: false, stars: 0 })),
    C1: Array.from({ length: 30 }, (_, i) => ({ id: `C1-${i + 1}`, title: `C1 Lesson ${i + 1}`, completed: false, stars: 0 })),
};

const placementTestQuestions = [ { question: "The children ___ playing in the garden.", options: ["is", "are", "am", "be"], answer: "are" }, { question: "I haven't seen him ___ last year.", options: ["since", "for", "from", "at"], answer: "since" }, { question: "If I ___ you, I would study harder.", options: ["was", "am", "were", "be"], answer: "were" }, { question: "She is interested ___ learning Spanish.", options: ["in", "on", "at", "for"], answer: "in" }, { question: "This is the ___ movie I have ever seen.", options: ["good", "better", "best", "well"], answer: "best" }, { question: "He drove ___ to avoid the traffic.", options: ["careful", "carefully", "care", "caring"], answer: "carefully" }, { question: "I wish I ___ fly.", options: ["can", "could", "would", "should"], answer: "could" }, { question: "The book is on the table, ___ it?", options: ["is", "isn't", "are", "aren't"], answer: "isn't" }, { question: "They ___ to the cinema yesterday.", options: ["go", "goes", "went", "gone"], answer: "went" }, { question: "My brother is taller ___ me.", options: ["that", "than", "then", "as"], answer: "than" }, { question: "We have ___ milk left.", options: ["a little", "a few", "many", "much"], answer: "a little" }, { question: "She ___ a beautiful song.", options: ["sing", "sings", "sang", "sung"], answer: "sang" }, { question: "I'm looking forward ___ you.", options: ["to see", "seeing", "to seeing", "see"], answer: "to seeing" }, { question: "Despite ___ tired, he finished the race.", options: ["be", "being", "was", "is"], answer: "being" }, { question: "The key ___ on the counter.", options: ["is", "are", "were", "be"], answer: "is" }, ];

const initialReadingMaterials = [ { id: 1, type: 'Story', title: 'The Lost Compass', content: "In a small village nestled between rolling hills, a young boy named Leo found an old brass compass. It didn't point north. Instead, it whispered directions to forgotten places and lost memories. One day, it led him to an ancient oak tree with a hidden door at its base. He opened it, and a wave of starlight and forgotten songs washed over him. He realized the compass didn't find places, but moments of wonder. He learned that the greatest adventures are not on a map, but in the heart." }, { id: 2, type: 'Article', title: 'The Power of Sleep', content: "Sleep is not just a period of rest; it's a critical biological process. During sleep, our brains consolidate memories, process information, and clear out metabolic waste. A lack of quality sleep can impair cognitive function, weaken the immune system, and affect our mood. Scientists recommend 7-9 hours of sleep for adults for optimal health. It's as important as a balanced diet and regular exercise. Prioritizing sleep is an investment in your physical and mental well-being." }, ];

// --- Gemini API Helper ---
async function runGemini(prompt, schema) {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API key is not set!");
        throw new Error("API key is missing.");
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", responseSchema: schema }
    };
    try {
        const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) {
            const errorBody = await response.text(); console.error("API Error Body:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        if (!result.candidates || result.candidates.length === 0) { throw new Error("No candidates returned from API."); }
        const jsonText = result.candidates[0].content.parts[0].text;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
}

// --- Custom Hook for Local Storage (Robust Version) ---
function usePersistentState(key, defaultValue) {
    const [state, setState] = useState(defaultValue);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue) {
                setState(JSON.parse(storedValue));
            }
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            window.localStorage.removeItem(key); // Clear corrupted data
            setState(defaultValue);
        }
        setIsHydrated(true);
    }, [key, defaultValue]);

    useEffect(() => {
        if (isHydrated) {
            try {
                window.localStorage.setItem(key, JSON.stringify(state));
            } catch (error) {
                console.error(`Error writing to localStorage key “${key}”:`, error);
            }
        }
    }, [key, state, isHydrated]);

    return [state, setState, isHydrated];
}

// --- المكونات الفرعية (معرفة خارج المكون الرئيسي) ---

const LingoCoveLogo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: '#38bdf8', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} />
            </linearGradient>
        </defs>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="url(#logoGradient)"/>
        <circle cx="12" cy="12" r="3.5" fill="white"/>
    </svg>
);

const WelcomeScreen = ({ onStart }) => ( <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in z-10 relative"> <LingoCoveLogo /> <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mt-4">LingoCove</h1> <p className="text-lg text-slate-600 mt-4 mb-8 max-w-lg">اغمر نفسك في أعماق اللغة الإنجليزية، من المياه الضحلة إلى خندق ماريانا.</p> <button onClick={onStart} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/30">ابدأ رحلتك البحرية ✨</button> </div> );

const PlacementTest = ({ onTestComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (selectedOption) => {
    if (selectedOption === placementTestQuestions[currentQuestion].answer) {
      setScore(score + 1);
    }
    if (currentQuestion < placementTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    let level;
    const percentage = (score / placementTestQuestions.length) * 100;
    if (percentage <= 20) level = 'A1';
    else if (percentage <= 40) level = 'A2';
    else if (percentage <= 60) level = 'B1';
    else if (percentage <= 80) level = 'B2';
    else level = 'C1';

    return (
      <div className="text-center animate-fade-in p-6 z-10 relative bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">اكتمل الاختبار!</h2>
        <p className="text-lg text-slate-600 mb-2">نتيجتك: {score} من {placementTestQuestions.length}</p>
        <p className="text-xl font-semibold text-slate-700 mb-6">
          تم تحديد عمقك المبدئي: <span className="text-sky-500 font-bold">{level} - {initialLevels[level].name}</span>
        </p>
        <button
          onClick={() => onTestComplete(level)}
          className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all"
        >
          اذهب إلى لوحة التحكم
        </button>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / placementTestQuestions.length) * 100;

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto animate-fade-in z-10 relative">
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">اختبار تحديد المستوى الذكي</h2>
      <p className="text-center text-slate-500 mb-6">السؤال {currentQuestion + 1} من {placementTestQuestions.length}</p>
      
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-6">
        <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm border border-slate-200 p-6 rounded-2xl shadow-lg">
        <p dir="ltr" className="text-xl text-slate-800 mb-6 min-h-[60px] text-left">{placementTestQuestions[currentQuestion].question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placementTestQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              dir="ltr"
              onClick={() => handleAnswer(option)}
              className="w-full text-left p-4 rounded-lg border-2 border-slate-200 bg-white/50 text-slate-800 hover:bg-slate-200 hover:border-sky-500 transition-all duration-200"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ... (All other sub-components are updated below with new styling and logic)

// --- المكون الرئيسي للتطبيق ---
export default function App() {
  const [isDarkMode, setIsDarkMode, isDarkModeHydrated] = usePersistentState('stellarSpeakIsDarkMode', true);
  const [page, setPage, isPageHydrated] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel, isUserLevelHydrated] = usePersistentState('stellarSpeakUserLevel', 'A1');
  const [lessonsDataState, setLessonsDataState, areLessonsHydrated] = usePersistentState('stellarSpeakLessonsData', initialLessonsData);
  const [streakData, setStreakData, isStreakHydrated] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [certificateToShow, setCertificateToShow] = useState(null);

  const isHydrated = isDarkModeHydrated && isPageHydrated && isUserLevelHydrated && areLessonsHydrated && isStreakHydrated;

  useEffect(() => {
    if (isHydrated) {
        // Streak Logic
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
    }
  }, [isHydrated, streakData, setStreakData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCompleteLesson = (lessonId, score, total) => {
      const levelId = lessonId.substring(0, 2);
      const stars = Math.max(1, Math.round((score / total) * 3));
      let updatedLessons;
      
      setLessonsDataState(prevData => {
          updatedLessons = prevData[levelId].map(lesson => 
              lesson.id === lessonId ? { ...lesson, completed: true, stars } : lesson
          );
          return { ...prevData, [levelId]: updatedLessons };
      });

      const isLevelComplete = updatedLessons.every(lesson => lesson.completed);
      if (isLevelComplete) {
          setCertificateToShow(levelId);
      } else {
          handleBackToLessons();
      }
  };
  
  const handleTestComplete = (level) => {
    setUserLevel(level);
    setPage('dashboard');
  };

  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setSelectedLevelId(null); setCurrentLesson(null); setPage('dashboard'); }
  const handleBackToLessons = () => { setCurrentLesson(null); setPage('lessons'); }
  const handleCertificateDownload = () => {
      setCertificateToShow(null);
      handleBackToDashboard();
  }
  
  if (!isHydrated) {
      return (
          <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
              <div className="animate-spin">
                  <LingoCoveLogo />
              </div>
          </div>
      );
  }

  const renderPage = () => {
    if (certificateToShow) {
        return <Certificate levelId={certificateToShow} onDownload={handleCertificateDownload} isDarkMode={isDarkMode} />
    }

    switch (page) {
      case 'welcome': return <WelcomeScreen onStart={() => setPage('test')} />;
      case 'test': return <PlacementTest onTestComplete={handleTestComplete} isDarkMode={isDarkMode} />;
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} isDarkMode={isDarkMode} />;
      case 'lessons': return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessonsDataState[selectedLevelId]} isDarkMode={isDarkMode} />;
      case 'lessonContent': return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} isDarkMode={isDarkMode} />;
      case 'writing': return <WritingSection isDarkMode={isDarkMode}/>;
      case 'reading': return <ReadingCenter isDarkMode={isDarkMode}/>;
      case 'roleplay': return <RolePlaySection isDarkMode={isDarkMode}/>;
      case 'pronunciation': return <PronunciationCoach isDarkMode={isDarkMode}/>;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} isDarkMode={isDarkMode}/>;
      default: return <WelcomeScreen onStart={() => setPage('dashboard')} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'الأعماق', icon: BookOpen },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'pronunciation', label: 'نطق', icon: Voicemail },
    { id: 'review', label: 'مراجعة', icon: History },
  ];

  return (
    <>
      <div id="bubbles-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>
          <div className="bubble-wrapper"><div></div></div>
          <div className="bubble-wrapper"><div></div></div>
          {/* ... more bubbles */}
      </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        <header className={`sticky top-0 z-20 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}>
                <LingoCoveLogo />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>LingoCove</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 dark:text-sky-400' : page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>
              ))}
            </div>
             <div className="flex items-center gap-4">
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}>
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
            <div className="flex justify-around items-center">
            {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-16 ${page.startsWith('lesson') && item.id === 'dashboard' ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}>
                    <item.icon size={22} />
                    <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
            </div>
        </footer>
      </div>
      <style jsx global>{`
            #bubbles-container {
                /* ... bubble animation styles ... */
            }
        `}</style>
    </>
  );
}

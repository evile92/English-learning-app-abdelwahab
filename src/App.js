import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Award, Sun, Moon, FileText, Download, MessageSquare, BrainCircuit, Library, Sparkles, Wand2, ArrowLeft, CheckCircle, LoaderCircle, XCircle, RefreshCw, Mic, Voicemail, Star, History, ShoppingCart, Users, Newspaper, Flame } from 'lucide-react';

// --- بيانات التطبيق المحدثة ---

const lessonTitles = {
  A1: [ "Verb 'to be' & Pronouns", "Plurals", "Articles (a/an/the)", "Possessive Adjectives", "This/That/These/Those", "There is / There are", "Have got / Has got", "Present Simple", "Adverbs of Frequency", "Can / Can’t for Ability", "Prepositions of Place", "Countable & Uncountable", "Much / Many / A lot of", "Imperatives", "Present Continuous", "Greetings & Introductions", "Numbers, Colors, Shapes", "Family and Friends", "Food and Drinks", "Places in Town", "Transport", "Weather and Seasons", "Clothes", "Daily Routines", "Hobbies and Activities", "Review: A1 Grammar Part 1", "Review: A1 Grammar Part 2", "Review: A1 Vocabulary Part 1", "Review: A1 Vocabulary Part 2", "Final A1 Test" ],
  A2: [ "Past Simple (Regular & Irregular)", "Past Simple vs. Continuous", "Future: 'going to' & 'will'", "Comparatives & Superlatives", "Present Continuous for Future", "How much / How many", "Some/Any/No Compounds", "Object Pronouns", "Possessive Pronouns", "Modals: must/have to", "Quantifiers (few, little)", "Adverbs of Manner", "Too / Enough", "Present Perfect", "First Conditional", "Travel and Holidays", "Health and Illnesses", "Technology and Gadgets", "Jobs and Professions", "Sports and Activities", "Festivals & Celebrations", "Describing People", "Daily Actions", "International Food", "Shopping and Money", "Review: A2 Grammar Part 1", "Review: A2 Grammar Part 2", "Review: A2 Vocabulary Part 1", "Review: A2 Vocabulary Part 2", "Final A2 Test" ],
  B1: [ "Present Perfect Continuous", "Past Perfect", "Past Perfect Continuous", "Future Continuous & Perfect", "Second Conditional", "Relative Clauses", "Reported Speech", "Gerunds & Infinitives", "Modals for Speculation", "Passive Voice", "Question Tags", "So / Such", "Enough / Too with Adjectives", "Wish / If only", "Causative Form (have/get)", "Social Issues", "Environment & Climate", "Culture and Arts", "News and Media", "Relationships", "Education and Learning", "World Travel", "Historical Events", "Advanced Technology", "Lifestyle and Health", "Review: B1 Grammar Part 1", "Review: B1 Grammar Part 2", "Review: B1 Vocabulary Part 1", "Review: B1 Vocabulary Part 2", "Final B1 Test" ],
  B2: [ "Mixed Conditionals", "Advanced Passive Forms", "Advanced Modals", "Inversion for Emphasis", "Future in the Past", "Advanced Reported Speech", "Participle Clauses", "Nominalisation", "Non-defining Relative Clauses", "Subjunctive Mood", "Complex Connectors", "Advanced Verb Patterns", "Emphatic Structures", "Ellipsis & Substitution", "Hedging & Softening", "Business and Corporate Terms", "Economics and Finance", "Science and Inventions", "Philosophy & Abstract Ideas", "Politics & Int. Relations", "Literary Analysis", "Body Language", "Debates and Discussions", "Idiomatic Expressions", "Academic Terminology", "Review: B2 Grammar Part 1", "Review: B2 Grammar Part 2", "Review: B2 Vocabulary Part 1", "Review: B2 Vocabulary Part 2", "Final B2 Test" ],
  C1: [ "Advanced Conditionals", "Complex Inversion Patterns", "Advanced Passive", "Modals in Past & Future", "Cleft Sentences", "Advanced Linking Devices", "Elliptical Structures", "Subjunctive in Formal Contexts", "Nominal Clauses", "Reported Speech Nuances", "Mixed Verb Patterns", "Relative Clauses w/ Prepositions", "Emphasis & Word Order", "Hedging for Academia", "Advanced Discourse Markers", "Legal Terminology", "Academic Research Vocab", "Scientific Terminology", "Figurative Language", "Advanced Medical Terms", "Specialized Journalism", "Political Rhetoric", "Nuanced Emotions", "Creative Writing Vocab", "Critical Expression", "Review: C1 Grammar Part 1", "Review: C1 Grammar Part 2", "Review: C1 Vocabulary Part 1", "Review: C1 Vocabulary Part 2", "Final C1 Test" ],
};

const initialLessonsData = Object.keys(lessonTitles).reduce((acc, level) => {
    acc[level] = lessonTitles[level].map((title, i) => ({
        id: `${level}-${i + 1}`,
        title: title,
        completed: false,
        stars: 0
    }));
    return acc;
}, {});

const initialLevels = {
  A1: { name: "كوكب الأساسيات", icon: "A1", lessons: 30, color: "from-sky-500 to-indigo-500" },
  A2: { name: "قمر البناء", icon: "A2", lessons: 30, color: "from-teal-400 to-cyan-500" },
  B1: { name: "سديم المتوسطين", icon: "B1", lessons: 30, color: "from-amber-400 to-orange-500" },
  B2: { name: "مجرة الطلاقة", icon: "B2", lessons: 30, color: "from-orange-500 to-red-600" },
  C1: { name: "سديم الحكمة", icon: "C1", lessons: 30, color: "from-purple-600 to-indigo-700" },
};

const placementTestQuestionsByLevel = {
    A1: [
        { question: "___ name is John.", options: ["I", "My", "Me", "Mine"], answer: "My" },
        { question: "They ___ from Spain.", options: ["is", "are", "am", "be"], answer: "are" },
        { question: "Can you pass me ___ apple, please?", options: ["a", "an", "the", "any"], answer: "an" },
        { question: "Look at ___ birds in the sky!", options: ["this", "that", "these", "those"], answer: "those" },
        { question: "There ___ a book on the table.", options: ["is", "are", "have", "has"], answer: "is" }
    ],
    A2: [
        { question: "I ___ to the cinema yesterday.", options: ["go", "goes", "went", "gone"], answer: "went" },
        { question: "She is ___ than her brother.", options: ["tall", "taller", "tallest", "more tall"], answer: "taller" },
        { question: "We are ___ visit our grandparents next week.", options: ["going to", "will", "go to", "goes to"], answer: "going to" },
        { question: "Have you ever ___ to Japan?", options: ["be", "been", "was", "were"], answer: "been" },
        { question: "You ___ touch that, it's dangerous.", options: ["must", "mustn't", "have to", "don't have to"], answer: "mustn't" }
    ],
    B1: [
        { question: "If I ___ more money, I would buy a new car.", options: ["have", "had", "will have", "would have"], answer: "had" },
        { question: "The Mona Lisa ___ by Leonardo da Vinci.", options: ["painted", "was painted", "has painted", "paints"], answer: "was painted" },
        { question: "He has been ___ for three hours.", options: ["study", "studying", "studied", "studies"], answer: "studying" },
        { question: "She told me she ___ tired.", options: ["is", "was", "has been", "had been"], answer: "was" },
        { question: "I enjoy ___ books in my free time.", options: ["read", "to read", "reading", "to reading"], answer: "reading" }
    ],
    B2: [
        { question: "By the time you arrive, I ___ dinner.", options: ["will finish", "will be finishing", "will have finished", "finish"], answer: "will have finished" },
        { question: "I wish I ___ earlier.", options: ["left", "had left", "leave", "would leave"], answer: "had left" },
        { question: "Despite ___ hard, he failed the exam.", options: ["studying", "he studied", "to study", "of studying"], answer: "studying" },
        { question: "It is ___ a beautiful day that we decided to go to the beach.", options: ["so", "such", "very", "too"], answer: "such" },
        { question: "The man ___ car was stolen went to the police.", options: ["who", "which", "that", "whose"], answer: "whose" }
    ],
    C1: [
        { question: "___ had I walked in the door than the phone rang.", options: ["No sooner", "Hardly", "Scarcely", "Barely"], answer: "No sooner" },
        { question: "The project, ___ was a great success, is now completed.", options: ["that", "which", "who", "whose"], answer: "which" },
        { question: "I'd rather you ___ that to me.", options: ["didn't say", "hadn't said", "don't say", "wouldn't say"], answer: "hadn't said" },
        { question: "She is considered ___ one of the best artists of her generation.", options: ["to be", "being", "be", "to being"], answer: "to be" },
        { question: "___ the weather, the picnic was a huge success.", options: ["Although", "Despite", "In spite", "Notwithstanding"], answer: "Notwithstanding" }
    ]
};


const initialReadingMaterials = [ { id: 1, type: 'Story', title: 'The Lost Compass', content: "In a small village nestled between rolling hills, a young boy named Leo found an old brass compass. It didn't point north. Instead, it whispered directions to forgotten places and lost memories. One day, it led him to an ancient oak tree with a hidden door at its base. He opened it, and a wave of starlight and forgotten songs washed over him. He realized the compass didn't find places, but moments of wonder. He learned that the greatest adventures are not on a map, but in the heart." }, { id: 2, type: 'Article', title: 'The Power of Sleep', content: "Sleep is not just a period of rest; it's a critical biological process. During sleep, our brains consolidate memories, process information, and clear out metabolic waste. A lack of quality sleep can impair cognitive function, weaken the immune system, and affect our mood. Scientists recommend 7-9 hours of sleep for adults for optimal health. It's as important as a balanced diet and regular exercise. Prioritizing sleep is an investment in your physical and mental well-being." }, ];

// --- Gemini API Helper ---
async function runGemini(prompt, schema) { /* ... (same as before) */ }

// --- Custom Hook for Local Storage ---
function usePersistentState(key, defaultValue) { /* ... (same as before) */ }

// --- المكونات الفرعية ---

const StellarSpeakLogo = () => ( <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <defs> <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%"> <stop offset="0%" style={{stopColor: '#38bdf8', stopOpacity: 1}} /> <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 1}} /> </linearGradient> </defs> <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" fill="url(#logoGradient)"/> <circle cx="12" cy="12" r="3.5" fill="white"/> </svg> );

const WelcomeScreen = ({ onStart }) => ( <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in z-10 relative"> <StellarSpeakLogo /> <h1 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mt-4 dark:text-shadow" style={{textShadow: '0 0 15px rgba(255,255,255,0.5)'}}>Stellar Speak</h1> <p className="text-lg text-slate-700 dark:text-slate-300 mt-4 mb-8 max-w-lg">انطلق في رحلة كونية لتعلم الإنجليزية، من كوكب المبتدئين إلى سديم الحكمة.</p> <button onClick={onStart} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50">ابدأ رحلتك الكونية ✨</button> </div> );

const PlacementTest = ({ onTestComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Generate and shuffle questions on component mount
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    const allQuestions = [];
    Object.values(placementTestQuestionsByLevel).forEach(levelQuestions => {
        allQuestions.push(...shuffleArray([...levelQuestions]).slice(0, 5));
    });

    setQuestions(shuffleArray(allQuestions));
  }, []);


  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    let level;
    if (score <= 5) level = 'A1';
    else if (score <= 10) level = 'A2';
    else if (score <= 15) level = 'B1';
    else if (score <= 20) level = 'B2';
    else level = 'C1';

    return (
      <div className="text-center animate-fade-in p-6 z-10 relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">اكتمل الاختبار!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">نتيجتك: {score} من {questions.length}</p>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-6">
          تم تحديد كوكبك المبدئي: <span className="text-sky-500 dark:text-sky-400 font-bold">{level} - {initialLevels[level].name}</span>
        </p>
        <button onClick={() => onTestComplete(level)} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">الخطوة التالية</button>
      </div>
    );
  }
  
  if (questions.length === 0) {
      return <div className="flex justify-center items-center"><LoaderCircle className="animate-spin text-sky-500" size={48} /></div>
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQData = questions[currentQuestion];

  return (
    <div className="p-4 md:p-8 w-full max-w-2xl mx-auto animate-fade-in z-10 relative">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-2">اختبار تحديد المستوى الذكي</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-6">السؤال {currentQuestion + 1} من {questions.length}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6"> <div className="bg-sky-500 dark:bg-sky-400 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s ease-in-out' }}></div> </div>
      <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
        <p dir="ltr" className="text-xl text-slate-800 dark:text-slate-200 mb-6 min-h-[60px] text-left">{currentQData.question}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQData.options.map((option, index) => ( <button key={index} dir="ltr" onClick={() => handleAnswer(option)} className="w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-sky-500 dark:hover:border-sky-400 transition-all duration-200"> {option} </button> ))}
        </div>
      </div>
    </div>
  );
};

const NameEntryScreen = ({ onNameSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };

    return (
        <div className="text-center animate-fade-in p-6 z-10 relative flex flex-col items-center justify-center h-full">
            <div className="w-full max-w-md bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">خطوة أخيرة!</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                    ما هو الاسم الذي تحب أن يظهر على شهاداتك؟
                </p>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="اكتب اسمك هنا..."
                        className="w-full p-3 text-lg text-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white"
                    />
                    <button type="submit" className="mt-6 w-full bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all">
                        انطلق إلى لوحة التحكم
                    </button>
                </form>
            </div>
        </div>
    );
};


// ... Other sub-components like Dashboard, LessonView, etc. remain the same as the last complete code you have.
// I will only paste the components that have changed: Certificate and App component.
const Certificate = ({ levelId, userName, onDownload }) => {
    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center z-10 relative">
            <h1 className="text-3xl font-bold text-white mb-2">تهانينا! 🏆</h1>
            <p className="text-slate-300 mb-6">لقد أكملت بنجاح متطلبات {initialLevels[levelId].name} وحصلت على هذه الشهادة.</p>
            <div className="w-full max-w-2xl aspect-[1.414] bg-slate-800/80 backdrop-blur-sm border-4 border-sky-400 p-8 rounded-lg shadow-2xl relative">
                <div className="text-center relative">
                    <Award size={60} className="mx-auto text-amber-400 mb-4" />
                    <p className="text-lg text-slate-300">Certificate of Achievement</p>
                    <h2 className="text-4xl font-bold text-sky-400 my-4">Level {levelId} Completion</h2>
                    <p className="text-lg text-slate-300">This certifies that</p>
                    <p className="text-3xl font-serif text-white my-4 border-b-2 border-dotted border-slate-500 pb-2">{userName || 'Stellar Student'}</p>
                    <p className="text-lg text-slate-300">has successfully completed all the requirements for Level {levelId} of the Stellar Speak program.</p>
                    <p className="mt-8 text-sm text-slate-400">Issued on: {new Date().toLocaleDateString()}</p>
                </div>
            </div>
            <button onClick={onDownload} className="mt-8 bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"><Download size={20} /> تحميل والعودة للمجرة</button>
        </div>
    );
};


// --- المكون الرئيسي للتطبيق ---
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

  useEffect(() => {
    const today = new Date().toDateString();
    if (streakData.lastVisit !== today) { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (streakData.lastVisit === yesterday.toDateString()) { setStreakData(prev => ({ count: prev.count + 1, lastVisit: today })); } else { setStreakData({ count: 1, lastVisit: today }); } }
    setTimeout(() => setIsInitialLoad(false), 50); 
  }, []);

  useEffect(() => { if (isDarkMode) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } }, [isDarkMode]);

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
        
        // Unlock next level
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
    if (certificateToShow) { return <Certificate levelId={certificateToShow} userName={userName} onDownload={handleCertificateDownload} /> }
    switch (page) {
      case 'welcome': return <WelcomeScreen onStart={() => setPage('test')} />;
      case 'test': return <PlacementTest onTestComplete={handleTestComplete} />;
      case 'nameEntry': return <NameEntryScreen onNameSubmit={handleNameSubmit} />;
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} streakData={streakData} />;
      case 'lessons': { if (!selectedLevelId || !lessonsDataState[selectedLevelId]) { handleBackToDashboard(); return null; } const lessons = lessonsDataState[selectedLevelId] || []; return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessons} />; }
      case 'lessonContent': { if (!currentLesson) { handleBackToLessons(); return null; } return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />; }
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'roleplay': return <RolePlaySection />;
      case 'pronunciation': return <PronunciationCoach />;
      case 'review': return <ReviewSection lessonsData={lessonsDataState} />;
      default: return <WelcomeScreen onStart={() => setPage('dashboard')} />;
    }
  };

  const navItems = [ { id: 'dashboard', label: 'المجرة', icon: BookOpen }, { id: 'writing', label: 'كتابة', icon: Feather }, { id: 'reading', label: 'قراءة', icon: Library }, { id: 'roleplay', label: 'محادثة', icon: Mic }, { id: 'pronunciation', label: 'نطق', icon: Voicemail }, { id: 'review', label: 'مراجعة', icon: History }, ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}> <div id="stars"></div> <div id="stars2"></div> <div id="stars3"></div> </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        <header className={`sticky top-0 z-20 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}> <StellarSpeakLogo /> <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span> </div>
            <div className="hidden md:flex items-center gap-6"> {navItems.map(item => ( <button key={item.id} onClick={() => setPage(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 dark:text-sky-400' : page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>))} </div>
            <div className="flex items-center gap-4"> <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}> {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} </button> </div>
          </nav>
        </header>
        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex justify-around items-center"> {navItems.map(item => ( <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-16 ${page.startsWith('lesson') && item.id === 'dashboard' ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}> <item.icon size={22} /> <span className="text-xs font-medium">{item.label}</span> </button> ))} </div>
        </footer>
      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } `}</style>
    </>
  );
}

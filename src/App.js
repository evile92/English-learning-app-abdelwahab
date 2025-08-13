import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Award, Sun, Moon, FileText, Download, MessageSquare, BrainCircuit, Library, Sparkles, Wand2, ArrowLeft, CheckCircle, LoaderCircle, XCircle, RefreshCw, Mic, Voicemail, Star, History, ShoppingCart, Users, Newspaper, Flame } from 'lucide-react';

// --- بيانات التطبيق ---
const initialLevels = {
  A1: { name: "كوكب الأساسيات", icon: "A1", lessons: 30, color: "from-sky-500 to-indigo-500" },
  A2: { name: "قمر البناء", icon: "A2", lessons: 30, color: "from-teal-400 to-cyan-500" },
  B1: { name: "سديم المتوسطين", icon: "B1", lessons: 30, color: "from-amber-400 to-orange-500" },
  B2: { name: "مجرة الطلاقة", icon: "B2", lessons: 30, color: "from-orange-500 to-red-600" },
  C1: { name: "ثقب الإتقان الأسود", icon: "C1", lessons: 30, color: "from-purple-600 to-indigo-700" },
};

const initialLessonsData = {
    A1: [ { id: 'A1-1', title: 'Grammar: Verb “to be” (am/is/are) – pronouns', completed: false, stars: 0 }, { id: 'A1-2', title: 'Vocabulary: Greetings and introductions', completed: false, stars: 0 }, { id: 'A1-3', title: 'Grammar: Plurals', completed: false, stars: 0 }, { id: 'A1-4', title: 'Vocabulary: Numbers, colors, shapes', completed: false, stars: 0 }, { id: 'A1-5', title: 'Grammar: Articles (a/an/the)', completed: false, stars: 0 }, { id: 'A1-6', title: 'Vocabulary: Family and friends', completed: false, stars: 0 }, { id: 'A1-7', title: 'Grammar: Possessive adjectives (my, your, his…)', completed: false, stars: 0 }, { id: 'A1-8', title: 'Vocabulary: Food and drinks', completed: false, stars: 0 }, { id: 'A1-9', title: 'Grammar: This/That/These/Those', completed: false, stars: 0 }, { id: 'A1-10', title: 'Review 1: "to be", Articles & Nouns', completed: false, stars: 0 }, { id: 'A1-11', title: 'Grammar: There is/There are', completed: false, stars: 0 }, { id: 'A1-12', title: 'Vocabulary: Places in town', completed: false, stars: 0 }, { id: 'A1-13', title: 'Grammar: Have got/Has got', completed: false, stars: 0 }, { id: 'A1-14', title: 'Vocabulary: Transport', completed: false, stars: 0 }, { id: 'A1-15', title: 'Grammar: Present Simple (affirmative/negative/questions)', completed: false, stars: 0 }, { id: 'A1-16', title: 'Vocabulary: Weather and seasons', completed: false, stars: 0 }, { id: 'A1-17', title: 'Grammar: Adverbs of frequency (always, usually…)', completed: false, stars: 0 }, { id: 'A1-18', title: 'Vocabulary: Clothes', completed: false, stars: 0 }, { id: 'A1-19', title: 'Grammar: Can/Can’t – ability', completed: false, stars: 0 }, { id: 'A1-20', title: 'Review 2: Present Simple & "Have got"', completed: false, stars: 0 }, { id: 'A1-21', title: 'Grammar: Prepositions of place (in, on, under…)', completed: false, stars: 0 }, { id: 'A1-22', title: 'Vocabulary: Daily routines', completed: false, stars: 0 }, { id: 'A1-23', title: 'Grammar: Countable & Uncountable nouns + some/any', completed: false, stars: 0 }, { id: 'A1-24', title: 'Vocabulary: Hobbies and activities', completed: false, stars: 0 }, { id: 'A1-25', title: 'Grammar: Much/Many/A lot of', completed: false, stars: 0 }, { id: 'A1-26', title: 'Grammar: Imperatives', completed: false, stars: 0 }, { id: 'A1-27', title: 'Grammar: Present Continuous', completed: false, stars: 0 }, { id: 'A1-28', title: 'Topic Focus: Describing your room', completed: false, stars: 0 }, { id: 'A1-29', title: 'Topic Focus: Ordering food', completed: false, stars: 0 }, { id: 'A1-30', title: 'A1 Final Review', completed: false, stars: 0 }, ],
    A2: [ { id: 'A2-1', title: 'Grammar: Past Simple (regular & irregular verbs)', completed: false, stars: 0 }, { id: 'A2-2', title: 'Vocabulary: Travel and holidays', completed: false, stars: 0 }, { id: 'A2-3', title: 'Grammar: Past Simple vs. Past Continuous', completed: false, stars: 0 }, { id: 'A2-4', title: 'Vocabulary: Health and illnesses', completed: false, stars: 0 }, { id: 'A2-5', title: 'Grammar: Future with “going to” & “will”', completed: false, stars: 0 }, { id: 'A2-6', title: 'Vocabulary: Technology and gadgets', completed: false, stars: 0 }, { id: 'A2-7', title: 'Grammar: Comparative & Superlative adjectives', completed: false, stars: 0 }, { id: 'A2-8', title: 'Vocabulary: Jobs and professions', completed: false, stars: 0 }, { id: 'A2-9', title: 'Grammar: Present Continuous for future arrangements', completed: false, stars: 0 }, { id: 'A2-10', title: 'Review 1: Past Tenses & Future Forms', completed: false, stars: 0 }, { id: 'A2-11', title: 'Grammar: How much/How many', completed: false, stars: 0 }, { id: 'A2-12', title: 'Vocabulary: Sports and activities', completed: false, stars: 0 }, { id: 'A2-13', title: 'Grammar: Some/Any/No/Every + compounds', completed: false, stars: 0 }, { id: 'A2-14', title: 'Vocabulary: Festivals and celebrations', completed: false, stars: 0 }, { id: 'A2-15', title: 'Grammar: Object pronouns & Possessive pronouns', completed: false, stars: 0 }, { id: 'A2-16', title: 'Vocabulary: Describing people', completed: false, stars: 0 }, { id: 'A2-17', title: 'Grammar: Modals: must/mustn’t/have to/don’t have to', completed: false, stars: 0 }, { id: 'A2-18', title: 'Vocabulary: Daily actions', completed: false, stars: 0 }, { id: 'A2-19', title: 'Grammar: Quantifiers (few, a few, little, a little)', completed: false, stars: 0 }, { id: 'A2-20', title: 'Review 2: Modals & Quantifiers', completed: false, stars: 0 }, { id: 'A2-21', title: 'Grammar: Adverbs of manner (quickly, slowly…)', completed: false, stars: 0 }, { id: 'A2-22', title: 'Vocabulary: International food', completed: false, stars: 0 }, { id: 'A2-23', title: 'Grammar: Too/Enough', completed: false, stars: 0 }, { id: 'A2-24', title: 'Vocabulary: Shopping and money', completed: false, stars: 0 }, { id: 'A2-25', title: 'Grammar: Present Perfect (just, already, yet, ever, never)', completed: false, stars: 0 }, { id: 'A2-26', title: 'Topic Focus: Planning a trip', completed: false, stars: 0 }, { id: 'A2-27', title: 'Grammar: First Conditional', completed: false, stars: 0 }, { id: 'A2-28', title: 'Topic Focus: Talking about experiences', completed: false, stars: 0 }, { id: 'A2-29', title: 'Topic Focus: Giving advice', completed: false, stars: 0 }, { id: 'A2-30', title: 'A2 Final Review', completed: false, stars: 0 }, ],
    B1: [ { id: 'B1-1', title: 'Grammar: Present Perfect Continuous', completed: false, stars: 0 }, { id: 'B1-2', title: 'Vocabulary: Social issues', completed: false, stars: 0 }, { id: 'B1-3', title: 'Grammar: Past Perfect & Past Perfect Continuous', completed: false, stars: 0 }, { id: 'B1-4', title: 'Vocabulary: Environment and climate change', completed: false, stars: 0 }, { id: 'B1-5', title: 'Grammar: Future Continuous & Future Perfect', completed: false, stars: 0 }, { id: 'B1-6', title: 'Vocabulary: Culture and arts', completed: false, stars: 0 }, { id: 'B1-7', title: 'Grammar: Second Conditional', completed: false, stars: 0 }, { id: 'B1-8', title: 'Vocabulary: News and media', completed: false, stars: 0 }, { id: 'B1-9', title: 'Grammar: Relative clauses (who, which, that, where…)', completed: false, stars: 0 }, { id: 'B1-10', title: 'Review 1: Perfect Tenses & Conditionals', completed: false, stars: 0 }, { id: 'B1-11', title: 'Grammar: Reported Speech (statements, questions)', completed: false, stars: 0 }, { id: 'B1-12', title: 'Vocabulary: Relationships and friendships', completed: false, stars: 0 }, { id: 'B1-13', title: 'Grammar: Reported Speech (commands)', completed: false, stars: 0 }, { id: 'B1-14', title: 'Vocabulary: Education and learning', completed: false, stars: 0 }, { id: 'B1-15', title: 'Grammar: Gerunds & Infinitives', completed: false, stars: 0 }, { id: 'B1-16', title: 'Vocabulary: World travel', completed: false, stars: 0 }, { id: 'B1-17', title: 'Grammar: Modals for speculation (might, could, can’t + have)', completed: false, stars: 0 }, { id: 'B1-18', title: 'Vocabulary: Historical events', completed: false, stars: 0 }, { id: 'B1-19', title: 'Grammar: Passive voice (present, past, future)', completed: false, stars: 0 }, { id: 'B1-20', title: 'Review 2: Reported Speech & Passives', completed: false, stars: 0 }, { id: 'B1-21', title: 'Grammar: Question tags', completed: false, stars: 0 }, { id: 'B1-22', title: 'Vocabulary: Advanced technology', completed: false, stars: 0 }, { id: 'B1-23', title: 'Grammar: So/Such & Enough/Too + adjectives', completed: false, stars: 0 }, { id: 'B1-24', title: 'Vocabulary: Lifestyle and health', completed: false, stars: 0 }, { id: 'B1-25', title: 'Grammar: Wish/If only (present & past)', completed: false, stars: 0 }, { id: 'B1-26', title: 'Topic Focus: Discussing news', completed: false, stars: 0 }, { id: 'B1-27', title: 'Grammar: Causative form (have/get something done)', completed: false, stars: 0 }, { id: 'B1-28', title: 'Topic Focus: Talking about regrets', completed: false, stars: 0 }, { id: 'B1-29', title: 'Topic Focus: Describing cultural events', completed: false, stars: 0 }, { id: 'B1-30', title: 'B1 Final Review', completed: false, stars: 0 }, ],
    B2: [ { id: 'B2-1', title: 'Grammar: Mixed Conditionals', completed: false, stars: 0 }, { id: 'B2-2', title: 'Vocabulary: Business and corporate terms', completed: false, stars: 0 }, { id: 'B2-3', title: 'Grammar: Advanced Passive forms', completed: false, stars: 0 }, { id: 'B2-4', title: 'Vocabulary: Economics and finance', completed: false, stars: 0 }, { id: 'B2-5', title: 'Grammar: Advanced Modals (deduction, advice, criticism)', completed: false, stars: 0 }, { id: 'B2-6', title: 'Vocabulary: Science and inventions', completed: false, stars: 0 }, { id: 'B2-7', title: 'Grammar: Inversion for emphasis', completed: false, stars: 0 }, { id: 'B2-8', title: 'Vocabulary: Philosophy and abstract ideas', completed: false, stars: 0 }, { id: 'B2-9', title: 'Grammar: Future in the past', completed: false, stars: 0 }, { id: 'B2-10', title: 'Review 1: Advanced Conditionals & Passives', completed: false, stars: 0 }, { id: 'B2-11', title: 'Grammar: Reported Speech (advanced)', completed: false, stars: 0 }, { id: 'B2-12', title: 'Vocabulary: Politics and international relations', completed: false, stars: 0 }, { id: 'B2-13', title: 'Grammar: Participle clauses', completed: false, stars: 0 }, { id: 'B2-14', title: 'Vocabulary: Literary analysis', completed: false, stars: 0 }, { id: 'B2-15', title: 'Grammar: Nominalisation', completed: false, stars: 0 }, { id: 'B2-16', title: 'Vocabulary: Body language and communication', completed: false, stars: 0 }, { id: 'B2-17', title: 'Grammar: Relative clauses (non-defining, reduced)', completed: false, stars: 0 }, { id: 'B2-18', title: 'Vocabulary: Debates and discussions', completed: false, stars: 0 }, { id: 'B2-19', title: 'Grammar: Subjunctive mood', completed: false, stars: 0 }, { id: 'B2-20', title: 'Review 2: Clauses & Advanced Structures', completed: false, stars: 0 }, { id: 'B2-21', title: 'Grammar: Complex sentence connectors (although, etc.)', completed: false, stars: 0 }, { id: 'B2-22', title: 'Vocabulary: Idiomatic expressions', completed: false, stars: 0 }, { id: 'B2-23', title: 'Grammar: Advanced verb patterns', completed: false, stars: 0 }, { id: 'B2-24', title: 'Vocabulary: Academic terminology', completed: false, stars: 0 }, { id: 'B2-25', title: 'Grammar: Emphatic structures (What I need is…)', completed: false, stars: 0 }, { id: 'B2-26', title: 'Topic Focus: Formal debates', completed: false, stars: 0 }, { id: 'B2-27', title: 'Grammar: Ellipsis & Substitution', completed: false, stars: 0 }, { id: 'B2-28', title: 'Topic Focus: Analyzing a text', completed: false, stars: 0 }, { id: 'B2-29', title: 'Grammar: Hedging & Softening language', completed: false, stars: 0 }, { id: 'B2-30', title: 'B2 Final Review', completed: false, stars: 0 }, ],
    C1: [ { id: 'C1-1', title: 'Grammar: Advanced Conditionals & Hypothetical structures', completed: false, stars: 0 }, { id: 'C1-2', title: 'Vocabulary: Legal terminology', completed: false, stars: 0 }, { id: 'C1-3', title: 'Grammar: Complex Inversion patterns', completed: false, stars: 0 }, { id: 'C1-4', title: 'Vocabulary: Academic research vocabulary', completed: false, stars: 0 }, { id: 'C1-5', title: 'Grammar: Advanced Passive transformations', completed: false, stars: 0 }, { id: 'C1-6', title: 'Vocabulary: Scientific terminology', completed: false, stars: 0 }, { id: 'C1-7', title: 'Grammar: Modals in the past & future for nuance', completed: false, stars: 0 }, { id: 'C1-8', title: 'Vocabulary: Figurative and poetic language', completed: false, stars: 0 }, { id: 'C1-9', title: 'Grammar: Cleft sentences', completed: false, stars: 0 }, { id: 'C1-10', title: 'Review 1: Advanced Grammar Structures', completed: false, stars: 0 }, { id: 'C1-11', title: 'Grammar: Advanced linking devices', completed: false, stars: 0 }, { id: 'C1-12', title: 'Vocabulary: Advanced medical terms', completed: false, stars: 0 }, { id: 'C1-13', title: 'Grammar: Elliptical structures', completed: false, stars: 0 }, { id: 'C1-14', title: 'Vocabulary: Specialized journalism language', completed: false, stars: 0 }, { id: 'C1-15', title: 'Grammar: Subjunctive in formal contexts', completed: false, stars: 0 }, { id: 'C1-16', title: 'Vocabulary: Political rhetoric', completed: false, stars: 0 }, { id: 'C1-17', title: 'Grammar: Nominal clauses', completed: false, stars: 0 }, { id: 'C1-18', title: 'Vocabulary: Nuanced emotional expressions', completed: false, stars: 0 }, { id: 'C1-19', title: 'Grammar: Advanced reported speech nuances', completed: false, stars: 0 }, { id: 'C1-20', title: 'Review 2: Clauses & Formal Language', completed: false, stars: 0 }, { id: 'C1-21', title: 'Grammar: Mixed verb patterns with subtle meaning changes', completed: false, stars: 0 }, { id: 'C1-22', title: 'Vocabulary: Creative writing vocabulary', completed: false, stars: 0 }, { id: 'C1-23', title: 'Grammar: Relative clauses with prepositions', completed: false, stars: 0 }, { id: 'C1-24', title: 'Vocabulary: Critical and analytical expression', completed: false, stars: 0 }, { id: 'C1-25', title: 'Grammar: Emphasis & word order shifts', completed: false, stars: 0 }, { id: 'C1-26', title: 'Topic Focus: Academic writing style', completed: false, stars: 0 }, { id: 'C1-27', title: 'Grammar: Hedging for academic writing', completed: false, stars: 0 }, { id: 'C1-28', title: 'Topic Focus: Public speaking', completed: false, stars: 0 }, { id: 'C1-29', title: 'Grammar: Advanced discourse markers', completed: false, stars: 0 }, { id: 'C1-30', title: 'C1 Final Review & Prep for C2', completed: false, stars: 0 }, ],
};

// ... (All other data remains the same)

// ... (All sub-components remain the same until the main App component)

// --- المكون الرئيسي للتطبيق ---
export default function App() {
  const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', 'A1');
  const [lessonsDataState, setLessonsDataState] = usePersistentState('stellarSpeakLessonsData', initialLessonsData);
  const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
  
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [certificateToShow, setCertificateToShow] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
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
    setIsInitialLoad(false);
  }, []);

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
  
  if (isInitialLoad) {
      return (
          <div className="fixed inset-0 bg-slate-900 flex items-center justify-center">
              <div className="animate-spin">
                  <StellarSpeakLogo />
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
    { id: 'dashboard', label: 'المجرة', icon: BookOpen },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'roleplay', label: 'محادثة', icon: Mic },
    { id: 'pronunciation', label: 'نطق', icon: Voicemail },
    { id: 'review', label: 'مراجعة', icon: History },
  ];

  return (
    <>
      <div id="stars-container" className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
      </div>
      <div className={`relative z-10 min-h-screen font-sans ${isDarkMode ? 'bg-slate-900/80 text-slate-200' : 'bg-gradient-to-b from-sky-50 to-sky-200 text-slate-800'}`}>
        <header className={`sticky top-0 z-20 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}>
                <StellarSpeakLogo />
                <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span>
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
            #stars-container {
                pointer-events: none;
            }
            @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} }
            #stars, #stars2, #stars3 {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                display: block;
                background-repeat: repeat;
                background-position: 0 0;
            }
            #stars {
                background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
                animation: move-twink-back 200s linear infinite;
            }
            #stars2 {
                background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
                animation: move-twink-back 150s linear infinite;
                opacity: 0.6;
            }
            #stars3 {
                background-image: url('https://www.transparenttextures.com/patterns/stardust.png');
                animation: move-twink-back 100s linear infinite;
                opacity: 0.3;
            }
        `}</style>
    </>
  );
}

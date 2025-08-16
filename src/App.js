import React, { useState, useEffect, useRef } from 'react';
// (أضفنا أيقونة البحث الجديدة)
import { BookOpen, Feather, Award, Sun, Moon, FileText, Download, MessageSquare, BrainCircuit, Library, Sparkles, Wand2, ArrowLeft, CheckCircle, LoaderCircle, XCircle, RefreshCw, Mic, Voicemail, Star, History, ShoppingCart, Users, Newspaper, Flame, Search } from 'lucide-react';

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

// --- Gemini API Helper (مع الإبقاء على اسم الموديل الأصلي) ---
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

// --- Custom Hook for Local Storage ---
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

// --- المكونات الفرعية ---

// --- مكون البحث الجديد ---
const SearchResults = ({ results, onSelectLesson, onClose }) => {
    if (results.length === 0) {
        return null;
    }
    return (
        <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose}>
            <div 
                className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white dark:bg-slate-800 rounded-lg shadow-2xl border dark:border-slate-700 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {results.map(lesson => (
                        <div 
                            key={lesson.id} 
                            onClick={() => onSelectLesson(lesson)}
                            className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md cursor-pointer"
                        >
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{lesson.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">المستوى: {lesson.id.substring(0,2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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


const Dashboard = ({ userLevel, onLevelSelect, lessonsData, streakData }) => { return ( <div className="p-4 md:p-8 animate-fade-in z-10 relative"> <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">مسارات التعلم (الكواكب والمجرات)</h1> <p className="text-slate-600 dark:text-slate-300">رحلتك الكونية تبدأ هنا. كل كوكب يمثل مستوى جديداً من الإتقان.</p></div><div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg"><Flame className="text-orange-500" size={24} /><span className="font-bold text-xl text-slate-700 dark:text-white">{streakData.count}</span><span className="text-sm text-slate-500 dark:text-slate-400">أيام متتالية</span></div></div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {Object.entries(initialLevels).map(([key, level]) => { const isLocked = Object.keys(initialLevels).indexOf(key) > Object.keys(initialLevels).indexOf(userLevel); const levelLessons = lessonsData[key] || []; const completedCount = levelLessons.filter(l => l.completed).length; const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0; return ( <div key={key} onClick={() => !isLocked && onLevelSelect(key)} className={`p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isLocked ? 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed' : `bg-gradient-to-br ${level.color} text-white cursor-pointer shadow-xl shadow-blue-500/20`}`}> <div className="flex justify-between items-start"> <div className="text-5xl font-bold opacity-80">{level.icon}</div> {isLocked && <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded-full">🔒 مغلق</span>} </div> <h3 className={`text-2xl font-bold mt-4 ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}>{level.name}</h3> <p className={`${isLocked ? 'text-slate-500 dark:text-slate-400' : 'opacity-80'} mt-1`}>{level.lessons} درسًا</p> {!isLocked && ( <div className="mt-4"> <div className="w-full bg-white/20 rounded-full h-2.5"><div className="bg-white h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div> <p className="text-sm mt-1 opacity-90">{Math.round(progress)}% مكتمل</p> </div> )} </div> ); })} </div> </div> ); };

const LessonView = ({ levelId, onBack, onSelectLesson, lessons }) => {
    const level = initialLevels[levelId];
    const completedCount = lessons.filter(l => l.completed).length;
    const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

    const truncateTitle = (title) => {
        if (title.length > 35) {
            return title.substring(0, 35) + '...';
        }
        return title;
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى المجرات</button>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-4xl font-bold`}>{level.icon}</div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{level.name}</h1>
                    <p className="text-slate-600 dark:text-slate-300">المستوى: {levelId}</p>
                </div>
            </div>
            <div className="mb-8">
                <p className="text-slate-700 dark:text-slate-200 mb-2">التقدم: {Math.round(progress)}%</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className={`bg-gradient-to-r ${level.color} h-4 rounded-full`} style={{ width: `${progress}%` }}></div></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">قائمة الدروس</h2>
            <div className="space-y-3">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex items-center justify-between transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${lesson.completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{lesson.completed ? <CheckCircle size={20}/> : lesson.id.split('-')[1]}</div>
                            <div className="flex-1 min-w-0">
                                <span className={`font-medium block truncate ${lesson.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`} title={lesson.title}>
                                    {truncateTitle(lesson.title)}
                                </span>
                                {lesson.completed && (<div className="flex">{[...Array(3)].map((_, i) => <Star key={i} size={14} className={i < lesson.stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} fill="currentColor"/>)}</div>)}
                            </div>
                        </div>
                        <button onClick={() => onSelectLesson(lesson)} className="text-sm flex-shrink-0 font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300">ابدأ</button>
                    </div>
                ))}
            </div>
        </div>
    );
};


const QuizView = ({ quiz, onQuizComplete }) => { const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); const [score, setScore] = useState(0); const [selectedOption, setSelectedOption] = useState(null); const [isAnswered, setIsAnswered] = useState(false); const handleAnswer = (option) => { if (isAnswered) return; setSelectedOption(option); setIsAnswered(true); if (option === quiz[currentQuestionIndex].correctAnswer) { setScore(score + 1); } }; const handleNext = () => { if (currentQuestionIndex < quiz.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); setIsAnswered(false); setSelectedOption(null); } else { onQuizComplete(score, quiz.length); } }; const getButtonClass = (option) => { if (!isAnswered) return 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-700'; if (option === quiz[currentQuestionIndex].correctAnswer) return 'bg-green-500/50 border-green-400'; if (option === selectedOption) return 'bg-red-500/50 border-red-400'; return 'bg-slate-800/50 opacity-60'; }; const currentQuestion = quiz[currentQuestionIndex]; return ( <div className="animate-fade-in"> <p className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-2">السؤال {currentQuestionIndex + 1} من {quiz.length}</p> <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg"> <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px] text-left">{currentQuestion.question}</h3> <div className="space-y-3"> {currentQuestion.options.map((option, i) => ( <button key={i} dir="ltr" onClick={() => handleAnswer(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(option)}`}> {option} </button> ))} </div> {isAnswered && ( <button onClick={handleNext} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all"> {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'} </button> )} </div> </div> ); };

const LessonContent = ({ lesson, onBack, onCompleteLesson }) => {
  const [lessonContent, setLessonContent] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [view, setView] = useState('lesson');
  const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
  const [error, setError] = useState('');
  const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });

  useEffect(() => {
    const generateLessonContent = async () => {
      setIsLoading(prev => ({ ...prev, lesson: true }));
      setError('');
      const level = lesson.id.substring(0, 2);
      
      const prompt = `You are an expert English teacher. For the lesson titled "${lesson.title}" for a ${level}-level student, generate a JSON object. The object must have two keys: 
      1. "explanation": an object with "en" (English explanation) and "ar" (Arabic clarification).
      2. "examples": an array of at least 10 practical example sentences.`;
      
      const schema = {
          type: "OBJECT",
          properties: {
              explanation: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] },
              examples: { type: "ARRAY", items: { type: "STRING" } }
          },
          required: ["explanation", "examples"]
      };

      try {
        const result = await runGemini(prompt, schema);
        setLessonContent(result);
      } catch (e) {
        setError('عذرًا، فشل تحميل محتوى الدرس.');
      } finally {
        setIsLoading(prev => ({ ...prev, lesson: false }));
      }
    };
    generateLessonContent();
  }, [lesson]);
  
  const handleStartQuiz = async () => {
    setIsLoading(prev => ({ ...prev, quiz: true }));
    setError('');
    const prompt = `Based on the English lesson about "${lesson.title}", create a JSON object for a quiz. The object must have a single key "quiz", with a value of an array of 8 multiple-choice questions. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer" (matching one of the options).`;
    const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] } } }, required: ["quiz"] };
    try {
      const result = await runGemini(prompt, schema);
      setQuiz(result.quiz);
      setView('quiz');
    } catch (e) {
      setError('عذرًا، فشل إنشاء الاختبار.');
    } finally {
      setIsLoading(prev => ({ ...prev, quiz: false }));
    }
  };

  const handleQuizComplete = (score, total) => { setQuizResult({ score, total }); setView('result'); };
  const handleLessonCompletion = () => { onCompleteLesson(lesson.id, quizResult.score, quizResult.total); };

  return (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative">
      <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words">{lesson.title}</h1>
      {isLoading.lesson && <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-10 rounded-2xl shadow-lg"><LoaderCircle className="animate-spin text-sky-500 dark:text-sky-400" size={48} /><p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">نقوم بإعداد الدرس لك...</p></div>}
      {error && !isLoading.lesson && <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert"><p className="font-bold">حدث خطأ</p><p>{error}</p></div>}
      
      {view === 'lesson' && lessonContent && (
        <div className="animate-fade-in">
          <div className="prose dark:prose-invert max-w-none mt-6 text-lg leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
            <h2 dir="ltr" className="text-left text-2xl font-bold text-slate-800 dark:text-white">Explanation</h2>
            <p dir="ltr" className="text-left" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.en}</p>
            <div dir="rtl" className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border-r-4 border-sky-500"> <p className="text-right text-slate-700 dark:text-slate-200" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.ar}</p> </div>
            <h3 dir="ltr" className="text-left text-xl font-bold mt-6 text-slate-800 dark:text-white">Examples</h3>
            <ol dir="ltr" className="list-decimal pl-5 space-y-2">{lessonContent.examples.map((ex, i) => <li key={i}>{ex}</li>)}</ol>
          </div>

          <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">🧠 اختبر معلوماتك</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">هل أنت مستعد لاختبار فهمك لهذا الدرس؟</p>
            <button onClick={handleStartQuiz} disabled={isLoading.quiz} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"> {isLoading.quiz ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> ابدأ الاختبار (8 أسئلة)</>} </button>
          </div>
        </div>
      )}

      {view === 'quiz' && quiz && <QuizView quiz={quiz} onQuizComplete={handleQuizComplete} />}
      {view === 'result' && ( <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in"> <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">اكتمل الاختبار!</h3> <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك هي:</p> <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">{quizResult.score} / {quizResult.total}</p> {quizResult.score / quizResult.total >= 0.8 ? ( <p className="text-green-600 dark:text-green-400 font-semibold">🎉 رائع! لقد أتقنت هذا الدرس.</p> ) : ( <p className="text-amber-600 dark:text-amber-400 font-semibold">👍 جيد! يمكنك مراجعة الدرس مرة أخرى لتعزيز فهمك.</p> )} <button onClick={handleLessonCompletion} className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all">إكمال الدرس والعودة</button> </div> )}
    </div>
  );
};

const WritingSection = () => { const [text, setText] = useState(''); const [correction, setCorrection] = useState(null); const [isLoading, setIsLoading] = useState(false); const [error, setError] = useState(''); const handleCorrect = async () => { if (!text.trim()) return; setIsLoading(true); setCorrection(null); setError(''); const prompt = `You are an expert English teacher. For the following text, provide a JSON object with three keys: 1. "correctedText": The original text with grammar/spelling mistakes fixed. 2. "improvedText": A more fluent, natural-sounding version. 3. "suggestions": An array of 3-4 specific, constructive suggestions. Each suggestion should be an object with two keys: "en" (the suggestion in English) and "ar" (a simple explanation of the suggestion in Arabic). Here is the text: "${text}"`; const schema = { type: "OBJECT", properties: { correctedText: { type: "STRING" }, improvedText: { type: "STRING" }, suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] } } }, required: ["correctedText", "improvedText", "suggestions"] }; try { const result = await runGemini(prompt, schema); setCorrection(result); } catch (e) { setError("عذرًا، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى."); } finally { setIsLoading(false); } }; return ( <div className="p-4 md:p-8 animate-fade-in z-10 relative"> <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Feather /> قسم الكتابة الإبداعي</h1> <p className="text-slate-600 dark:text-slate-300 mb-6">مساحة حرة للكتابة. اكتب أي شيء، ودعنا نساعدك على التحسين.</p> <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> <div> <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصك هنا باللغة الإنجليزية..." className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"></textarea> <button onClick={handleCorrect} disabled={isLoading} className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> {isLoading ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> صحح وحسّن النص</>} </button> </div> <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg min-h-[320px]"> <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">نتائج تحليلنا</h3> {isLoading && <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Wand2 className="animate-pulse" /> نقوم بتحليل النص...</p>} {error && <p className="text-red-500">{error}</p>} {correction && ( <div className="animate-fade-in space-y-4"> <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">النص المُصحح:</h4><p dir="ltr" className="text-left text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 p-3 rounded-md">{correction.correctedText}</p></div> <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">نسخة مُحسّنة:</h4><p dir="ltr" className="text-left text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 p-3 rounded-md">{correction.improvedText}</p></div> <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">اقتراحات للتحسين:</h4><ul className="space-y-2 text-slate-700 dark:text-slate-300">{correction.suggestions.map((s, i) => <li key={i} className="border-t border-slate-200 dark:border-slate-700 pt-2 mt-2"><p dir="ltr" className="text-left">{s.en}</p><p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{s.ar}</p></li>)}</ul></div> </div> )} {!isLoading && !correction && !error && <p className="text-slate-500 dark:text-slate-400">ستظهر النتائج هنا بعد التصحيح.</p>} </div> </div> </div> ); };

// --- مكون القراءة مع حل مشكلة التكرار ---
const ReadingCenter = () => {
    const [materials, setMaterials] = useState(initialReadingMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [generationType, setGenerationType] = useState('story');
    const [translation, setTranslation] = useState({ word: '', meaning: '', show: false, loading: false });

    // 1. أضفنا قائمة مواضيع متنوعة
    const storyTopics = ["a mysterious old map", "a robot with feelings", "an unexpected journey", "a magical bookstore", "a forgotten memory", "an adventure in space", "a talking animal"];
    const articleTopics = ["the benefits of learning a new language", "the future of technology", "the importance of sleep", "tips for healthy eating", "the impact of social media", "how to be more productive", "the wonders of the natural world"];

    const handleGenerate = async (type) => {
        setIsGenerating(true);
        setGenerationType(type);
        setError('');

        // 2. نختار موضوعًا عشوائيًا بناءً على النوع
        let topic = '';
        if (type === 'story') {
            topic = storyTopics[Math.floor(Math.random() * storyTopics.length)];
        } else {
            topic = articleTopics[Math.floor(Math.random() * articleTopics.length)];
        }

        // 3. نُنشئ طلبًا (Prompt) أكثر تحديدًا وذكاءً
        const prompt = `You are a creative writer. Generate a short ${type} for a B1-level English language learner about "${topic}". The content should be about 150 words long. Return the result as a JSON object with two keys: "title" and "content".`;
        const schema = { type: "OBJECT", properties: { title: { type: "STRING" }, content: { type: "STRING" } }, required: ["title", "content"] };
        
        try {
            const result = await runGemini(prompt, schema);
            const newMaterial = { id: Date.now(), type: type === 'story' ? 'Story' : 'Article', ...result };
            setMaterials(prev => [newMaterial, ...prev]);
        } catch (e) {
            setError("فشلت عملية التوليد. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleWordClick = async (word) => {
        const cleanedWord = word.replace(/[.,!?]/g, '').trim();
        if (!cleanedWord) return;

        setTranslation({ word: cleanedWord, meaning: '', show: true, loading: true });
        
        const prompt = `Translate the English word "${cleanedWord}" to Arabic. Return a JSON object with one key: "translation".`;
        const schema = { type: "OBJECT", properties: { translation: { type: "STRING" } }, required: ["translation"] };
        
        try {
            const result = await runGemini(prompt, schema);
            setTranslation({ word: cleanedWord, meaning: result.translation, show: true, loading: false });
        } catch (e) {
            setTranslation({ word: cleanedWord, meaning: 'فشلت الترجمة', show: true, loading: false });
        }
    };

    if (selectedMaterial) {
        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <button onClick={() => setSelectedMaterial(null)} className="mb-6 text-sky-500 dark:text-sky-400 hover:underline flex items-center"><ArrowLeft size={16} className="mr-1" /> العودة إلى المكتبة</button>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{selectedMaterial.title}</h2>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${selectedMaterial.type === 'Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{selectedMaterial.type}</span>
                <div className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    <p>
                        {selectedMaterial.content.split(/(\s+)/).map((segment, index) => (
                           segment.trim() ? 
                           <span key={index} onClick={() => handleWordClick(segment)} className="cursor-pointer hover:bg-sky-200 dark:hover:bg-sky-800/50 rounded-md p-0.5 -m-0.5 transition-colors">
                               {segment}
                           </span> :
                           <span key={index}>{segment}</span>
                        ))}
                    </p>
                </div>
                {translation.show && (
                    <div onClick={() => setTranslation({ word: '', meaning: '', show: false, loading: false })} className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4">
                        <div onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white" dir="ltr">{translation.word}</h3>
                            <div className="mt-4 min-h-[40px] flex items-center">
                                {translation.loading ? 
                                 <LoaderCircle className="animate-spin text-sky-500" /> :
                                 <p className="text-xl text-slate-600 dark:text-slate-300" dir="rtl">{translation.meaning}</p>
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return ( 
        <div className="p-4 md:p-8 animate-fade-in z-10 relative"> 
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8"> 
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">📖 مركز القراءة والتأمل</h1>
                    <p className="text-slate-600 dark:text-slate-300">اقرأ محتوى متنوعًا، أو قم بتوليد محتوى جديد بنفسك.</p>
                </div> 
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-2 rounded-lg shadow-sm"> 
                    <button onClick={() => handleGenerate('story')} disabled={isGenerating} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> 
                        {isGenerating && generationType === 'story' ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={16} /> توليد قصة</>} 
                    </button> 
                    <button onClick={() => handleGenerate('article')} disabled={isGenerating} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2"> 
                        {isGenerating && generationType === 'article' ? <LoaderCircle className="animate-spin" /> : <><Newspaper size={16} /> توليد مقال</>} 
                    </button> 
                </div> 
            </div> 
            {error && <p className="text-red-500 mb-4">{error}</p>} 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
                {materials.map(material => (
                    <div key={material.id} onClick={() => setSelectedMaterial(material)} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"> 
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${material.type === 'Story' ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300'}`}>{material.type}</span> 
                        <h3 className="text-xl font-bold mt-3 text-slate-800 dark:text-white">{material.title}</h3> 
                        <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{material.content}</p> 
                    </div>
                ))} 
            </div> 
        </div> 
    );
};

const Certificate = ({ levelId, userName, onDownload }) => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const textColor = isDarkMode ? 'text-white' : 'text-slate-800';
    const subtitleColor = isDarkMode ? 'text-slate-300' : 'text-slate-600';

    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center z-10 relative">
            <h1 className={`text-3xl font-bold ${textColor} mb-2`}>تهانينا! 🏆</h1>
            <p className={`${subtitleColor} mb-6`}>لقد أكملت بنجاح متطلبات {initialLevels[levelId].name} وحصلت على هذه الشهادة.</p>
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


const RolePlaySection = () => { const scenarios = { 'ordering-coffee': { title: 'طلب قهوة', emoji: '☕', prompt: "You are a friendly barista in a coffee shop. I am a customer. Start the conversation by greeting me and asking for my order. Keep your responses short and natural." }, 'asking-directions': { title: 'السؤال عن الاتجاهات', emoji: '🗺️', prompt: "You are a helpful local person on the street. I am a tourist who is lost. Start the conversation by asking if I need help. Keep your responses short and natural." }, 'shopping': { title: 'التسوق', emoji: '🛍️', prompt: "You are a shop assistant in a clothing store. I am a customer looking for a new jacket. Start the conversation by greeting me and asking how you can help. Keep your responses short and natural." }, 'talking-friend': { title: 'التحدث مع صديق', emoji: '😊', prompt: "You are my friend. I am telling you about my weekend. Start the conversation by asking me 'So, how was your weekend?'. Keep your responses friendly and natural." }, }; const [selectedScenario, setSelectedScenario] = useState(null); const [conversation, setConversation] = useState([]); const [userInput, setUserInput] = useState(''); const [isLoading, setIsLoading] = useState(false); const chatEndRef = useRef(null); useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [conversation]); const startConversation = async (scenarioKey) => { const scenario = scenarios[scenarioKey]; setSelectedScenario(scenario); setIsLoading(true); setConversation([]); setConversation([{ sender: 'system', text: `بدأت محادثة: ${scenario.title}. أنت تبدأ.` }]); setIsLoading(false); }; const handleSendMessage = async (e) => { e.preventDefault(); if (!userInput.trim() || isLoading) return; const newUserMessage = { sender: 'user', text: userInput }; const currentConversation = [...conversation, newUserMessage]; setConversation(currentConversation); setUserInput(''); setIsLoading(true); let fullPrompt = `Let's continue a role-play. ${selectedScenario.prompt}\n\n`; currentConversation.forEach(msg => { if (msg.sender === 'user') { fullPrompt += `Me: ${msg.text}\n`; } else if (msg.sender === 'ai') { fullPrompt += `You: ${msg.text}\n`; } }); fullPrompt += "You: "; const schema = { type: "OBJECT", properties: { response: { type: "STRING" } }, required: ["response"] }; try { const result = await runGemini(fullPrompt, schema); const aiMessage = { sender: 'ai', text: result.response }; setConversation(prev => [...prev, aiMessage]); } catch (error) { const errorMessage = { sender: 'system', text: 'عذرًا، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.' }; setConversation(prev => [...prev, errorMessage]); } finally { setIsLoading(false); } }; if (!selectedScenario) { return ( <div className="p-4 md:p-8 animate-fade-in z-10 relative"> <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Mic/> محادثات لعب الأدوار</h1> <p className="text-slate-600 dark:text-slate-300 mb-8">اختر سيناريو لممارسة مهارات المحادثة لديك مع الذكاء الاصطناعي.</p> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {Object.entries(scenarios).map(([key, scenario]) => ( <div key={key} onClick={() => startConversation(key)} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center"> <div className="text-5xl mb-4">{scenario.emoji}</div> <h3 className="text-xl font-bold text-slate-800 dark:text-white">{scenario.title}</h3> </div> ))} </div> </div> ); } return ( <div className="p-4 md:p-8 animate-fade-in z-10 relative"> <button onClick={() => setSelectedScenario(null)} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> اختر سيناريو آخر</button> <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">{selectedScenario.title} {selectedScenario.emoji}</h1> <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg h-[60vh] flex flex-col"> <div className="flex-1 p-4 overflow-y-auto space-y-4"> {conversation.map((msg, index) => ( <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-lg">🤖</div>} <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${ msg.sender === 'user' ? 'bg-sky-500 text-white rounded-br-none' : msg.sender === 'ai' ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 text-center w-full' }`}> <p dir="auto">{msg.text}</p> </div> </div> ))} <div ref={chatEndRef} /> </div> <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"> <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="اكتب ردك هنا..." className="flex-1 p-3 bg-slate-100 dark:bg-slate-900 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-white" disabled={isLoading} /> <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-sky-500 text-white rounded-full p-3 hover:bg-sky-600 disabled:bg-slate-400 transition-colors"> {isLoading ? <LoaderCircle className="animate-spin" /> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>} </button> </form> </div> </div> ); };

const PronunciationCoach = () => { const [text, setText] = useState('Hello, how are you today?'); const [status, setStatus] = useState('idle'); const handleListen = () => { if (!text.trim() || typeof window.speechSynthesis === 'undefined') { setStatus('error'); return; } setStatus('speaking'); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-US'; utterance.onend = () => setStatus('idle'); utterance.onerror = () => setStatus('error'); window.speechSynthesis.speak(utterance); }; return ( <div className="p-4 md:p-8 animate-fade-in z-10 relative"> <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Voicemail/> مدرب النطق</h1> <p className="text-slate-600 dark:text-slate-300 mb-8">اكتب أي جملة باللغة الإنجليزية واستمع إلى النطق الصحيح.</p> <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg"> <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصًا هنا..." className="w-full h-40 p-4 text-lg border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all" dir="ltr"></textarea> <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"> <button onClick={handleListen} disabled={status === 'speaking'} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"> {status === 'speaking' ? <LoaderCircle className="animate-spin" /> : <>🎧 استمع</>} </button> <button disabled className="w-full bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"> <Mic size={18}/> سجل صوتك (قريبًا) </button> </div> {status === 'error' && <p className="text-red-500 mt-4 text-center">عذرًا، حدث خطأ أو أن متصفحك لا يدعم هذه الميزة.</p>} </div> </div> ); };

const ReviewSection = ({ lessonsData }) => {
    const [view, setView] = useState('start'); // start, quiz, result, interactive
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    // For Quiz
    const [reviewQuiz, setReviewQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });

    // For Interactive Review
    const [interactiveExercises, setInteractiveExercises] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [results, setResults] = useState([]);

    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
    const topics = completedLessons.map(l => l.title).slice(-5).join(', '); // Use last 5 completed

    const handleStartQuizReview = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Based on these topics: "${topics}", create a JSON object for a quiz. The key "quiz" should be an array of 5 multiple-choice questions with "question", "options", and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] } } }, required: ["quiz"] };
        try {
            const result = await runGemini(prompt, schema);
            setReviewQuiz(result.quiz);
            setView('quiz');
        } catch (e) { setError('عذرًا، فشل إنشاء اختبار المراجعة.'); setView('start'); } 
        finally { setIsLoading(false); }
    };
    
    const handleStartInteractiveReview = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Based on these topics: "${topics}", create a JSON object for an interactive review. The key "exercises" should be an array of 5 objects, each with "sentence" (a sentence with '[___]' as a blank) and "correctAnswer".`;
        const schema = { type: "OBJECT", properties: { exercises: { type: "ARRAY", items: { type: "OBJECT", properties: { sentence: { type: "STRING" }, correctAnswer: { type: "STRING" } }, required: ["sentence", "correctAnswer"] } } }, required: ["exercises"] };
        try {
            const result = await runGemini(prompt, schema);
            setInteractiveExercises(result.exercises);
            setUserAnswers(Array(result.exercises.length).fill(''));
            setResults(Array(result.exercises.length).fill(null));
            setView('interactive');
        } catch (e) { setError('عذرًا، فشل إنشاء المراجعة التفاعلية.'); setView('start'); }
        finally { setIsLoading(false); }
    };

    const handleQuizComplete = (score, total) => {
        setQuizResult({ score, total });
        setView('result');
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...userAnswers];
        newAnswers[index] = value;
        setUserAnswers(newAnswers);
    };

    const checkAnswer = (index) => {
        const newResults = [...results];
        if (userAnswers[index].trim().toLowerCase() === interactiveExercises[index].correctAnswer.toLowerCase()) {
            newResults[index] = 'correct';
        } else {
            newResults[index] = 'incorrect';
        }
        setResults(newResults);
    };

    if (isLoading) {
        return <div className="flex flex-col items-center justify-center p-10"><LoaderCircle className="animate-spin text-sky-500" size={48} /><p className="mt-4 text-lg">نقوم بإعداد المراجعة لك...</p></div>;
    }

    if (view === 'quiz') {
        return <QuizView quiz={reviewQuiz} onQuizComplete={handleQuizComplete} />;
    }

    if (view === 'interactive') {
        return (
            <div className="z-10 relative animate-fade-in">
                <button onClick={() => setView('start')} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى خيارات المراجعة</button>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">مراجعة تفاعلية (املأ الفراغ)</h1>
                <div className="space-y-6">
                    {interactiveExercises.map((ex, index) => (
                        <div key={index} className="bg-white dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200 mb-3">{ex.sentence.replace('[___]', '_____')}</p>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input type="text" value={userAnswers[index]} onChange={(e) => handleAnswerChange(index, e.target.value)} className="flex-1 p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md" />
                                <button onClick={() => checkAnswer(index)} className="bg-sky-500 text-white font-semibold py-2 px-4 rounded-md">تحقق</button>
                            </div>
                            {results[index] === 'correct' && <p className="text-green-500 mt-2 font-semibold">صحيح!</p>}
                            {results[index] === 'incorrect' && <p className="text-red-500 mt-2 font-semibold">الإجابة الصحيحة: {ex.correctAnswer}</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    if (view === 'result') {
        return (
             <div className="p-4 md:p-8 animate-fade-in z-10 relative">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-4 text-center">نتيجة المراجعة</h1>
                <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center">
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">أحسنت!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك هي:</p>
                    <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">{quizResult.score} / {quizResult.total}</p>
                    <button onClick={() => setView('start')} className="mt-6 bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all">إجراء مراجعة أخرى</button>
                </div>
            </div>
        );
    }

    // Default view: 'start'
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><History/> قسم المراجعة</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">اختر الطريقة التي تفضلها لمراجعة الدروس التي أكملتها.</p>
            
            {completedLessons.length === 0 ? (
                 <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg text-center">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">لا توجد دروس للمراجعة</h3>
                    <p className="text-slate-600 dark:text-slate-300">أكمل بعض الدروس أولاً لتتمكن من إنشاء مراجعة.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">اختر نوع المراجعة</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">سنقوم بإنشاء مراجعة بناءً على آخر الدروس التي أكملتها:</p>
                    <ul className="list-disc list-inside mb-6 text-slate-500 dark:text-slate-400">
                        {completedLessons.slice(-5).map(l => <li key={l.id}>{l.title}</li>)}
                    </ul>
                    {error && <p className="text-red-500 my-4 text-center">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={handleStartQuizReview} disabled={isLoading} className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                           🧠 مراجعة عادية (أسئلة)
                        </button>
                         <button onClick={handleStartInteractiveReview} disabled={isLoading} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                           💡 مراجعة تفاعلية (املأ الفراغ)
                        </button>
                    </div>
                </div>
            )}
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

  // --- (بداية الإضافة) حالات البحث ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const allLessons = useRef(Object.values(initialLessonsData).flat());
  // --- (نهاية الإضافة) ---

  useEffect(() => {
    const today = new Date().toDateString();
    if (streakData.lastVisit !== today) { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (streakData.lastVisit === yesterday.toDateString()) { setStreakData(prev => ({ count: prev.count + 1, lastVisit: today })); } else { setStreakData({ count: 1, lastVisit: today }); } }
    setTimeout(() => setIsInitialLoad(false), 50); 
  }, []);

  useEffect(() => { if (isDarkMode) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); } }, [isDarkMode]);

  // --- (بداية الإضافة) منطق البحث ---
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
    setSearchQuery(''); // إفراغ البحث بعد الاختيار
  };
  // --- (نهاية الإضافة) ---

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
        <header className={`sticky top-0 z-30 backdrop-blur-lg border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-white/50 border-slate-200'}`}>
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}> <StellarSpeakLogo /> <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Stellar Speak</span> </div>
            
            {/* --- (بداية الإضافة) شريط البحث --- */}
            <div className="hidden md:flex items-center gap-6">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                      type="text"
                      placeholder="ابحث عن درس..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-slate-100 dark:bg-slate-800 rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
              </div>
              {navItems.map(item => ( <button key={item.id} onClick={() => setPage(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 dark:text-sky-400' : page === item.id ? 'text-sky-500 dark:text-sky-400' : (isDarkMode ? 'text-slate-300 hover:text-sky-400' : 'text-slate-600 hover:text-sky-500')}`}><item.icon size={20} />{item.label}</button>))} 
            </div>
            {/* --- (نهاية الإضافة) --- */}

            <div className="flex items-center gap-4"> <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}> {isDarkMode ? <Sun size={20} /> : <Moon size={20} />} </button> </div>
          </nav>
        </header>

        {/* --- (بداية الإضافة) عرض نتائج البحث --- */}
        <SearchResults 
            results={searchResults} 
            onSelectLesson={handleSearchSelect} 
            onClose={() => setSearchQuery('')}
        />
        {/* --- (نهاية الإضافة) --- */}

        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>
        <footer className={`md:hidden fixed bottom-0 left-0 right-0 backdrop-blur-lg border-t z-20 p-2 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex justify-around items-center"> {navItems.map(item => ( <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-16 ${page.startsWith('lesson') && item.id === 'dashboard' ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : page === item.id ? (isDarkMode ? 'text-sky-400 bg-sky-900/50' : 'text-sky-500 bg-sky-100') : (isDarkMode ? 'text-slate-300' : 'text-slate-600')}`}> <item.icon size={22} /> <span className="text-xs font-medium">{item.label}</span> </button> ))} </div>
        </footer>
      </div>
      <style jsx global>{` #stars-container { pointer-events: none; } @keyframes move-twink-back { from {background-position:0 0;} to {background-position:-10000px 5000px;} } #stars, #stars2, #stars3 { position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; display: block; background-repeat: repeat; background-position: 0 0; } #stars { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 200s linear infinite; } #stars2 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 150s linear infinite; opacity: 0.6; } #stars3 { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); animation: move-twink-back 100s linear infinite; opacity: 0.3; } `}</style>
    </>
  );
}

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
  A1: Array.from({ length: 30 }, (_, i) => ({ id: `A1-${i + 1}`, title: 'A1 Lesson ' + (i + 1), completed: false, stars: 0 })),
  A2: Array.from({ length: 30 }, (_, i) => ({ id: `A2-${i + 1}`, title: 'A2 Lesson ' + (i + 1), completed: false, stars: 0 })),
  B1: Array.from({ length: 30 }, (_, i) => ({ id: `B1-${i + 1}`, title: 'B1 Lesson ' + (i + 1), completed: false, stars: 0 })),
  B2: Array.from({ length: 30 }, (_, i) => ({ id: `B2-${i + 1}`, title: 'B2 Lesson ' + (i + 1), completed: false, stars: 0 })),
  C1: Array.from({ length: 30 }, (_, i) => ({ id: `C1-${i + 1}`, title: 'C1 Lesson ' + (i + 1), completed: false, stars: 0 })),
};

const placementTestQuestions = [ { question: "The children ___ playing in the garden.", options: ["is", "are", "am", "be"], answer: "are" }, { question: "I haven't seen him ___ last year.", options: ["since", "for", "from", "at"], answer: "since" }, { question: "If I ___ you, I would study harder.", options: ["was", "am", "were", "be"], answer: "were" }, { question: "She is interested ___ learning Spanish.", options: ["in", "on", "at", "for"], answer: "in" }, { question: "This is the ___ movie I have ever seen.", options: ["good", "better", "best", "well"], answer: "best" }, { question: "He drove ___ to avoid the traffic.", options: ["careful", "carefully", "care", "caring"], answer: "carefully" }, { question: "I wish I ___ fly.", options: ["can", "could", "would", "should"], answer: "could" }, { question: "The book is on the table, ___ it?", options: ["is", "isn't", "are", "aren't"], answer: "isn't" }, { question: "They ___ to the cinema yesterday.", options: ["go", "goes", "went", "gone"], answer: "went" }, { question: "My brother is taller ___ me.", options: ["that", "than", "then", "as"], answer: "than" }, { question: "We have ___ milk left.", options: ["a little", "a few", "many", "much"], answer: "a little" }, { question: "She ___ a beautiful song.", options: ["sing", "sings", "sang", "sung"], answer: "sang" }, { question: "I'm looking forward ___ you.", options: ["to see", "seeing", "to seeing", "see"], answer: "to seeing" }, { question: "Despite ___ tired, he finished the race.", options: ["be", "being", "was", "is"], answer: "being" }, { question: "The key ___ on the counter.", options: ["is", "are", "were", "be"], answer: "is" }, ];

// --- Gemini API Helper ---
async function runGemini(prompt, schema) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API key is not set!");
    throw new Error("API key is missing.");
  }
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", responseSchema: schema }
  };

  try {
    const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("API Error Body:", errorBody);
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

// --- Custom Hook for Local Storage (النسخة المعدلة) ---
function usePersistentState(key, defaultValue) {
  const [state, setState] = useState(() => {
    // هذه الدالة ستعمل مرة واحدة فقط عند التهيئة الأولية
    // لتجنب وميض الواجهة عند التحميل (FOUC)
    if (typeof window !== 'undefined') {
        try {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue) {
                return JSON.parse(storedValue);
            }
        } catch (error) {
            console.error("Error reading from localStorage on init", error);
        }
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

const StellarSpeakLogo = () => (
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

const WelcomeScreen = ({ onStart }) => ( <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in z-10 relative"> <StellarSpeakLogo /> <h1 className="text-5xl md:text-6xl font-bold text-slate-800 dark:text-white mt-4 dark:text-shadow" style={{textShadow: '0 0 15px rgba(255,255,255,0.5)'}}>Stellar Speak</h1> <p className="text-lg text-slate-700 dark:text-slate-300 mt-4 mb-8 max-w-lg">انطلق في رحلة كونية لتعلم الإنجليزية، من كوكب المبتدئين إلى ثقب الإتقان الأسود.</p> <button onClick={onStart} className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/50">ابدأ رحلتك الكونية ✨</button> </div> );

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
      <div className="text-center animate-fade-in p-6 z-10 relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">اكتمل الاختبار!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">نتيجتك: {score} من {placementTestQuestions.length}</p>
        <p className="text-xl text-slate-800 dark:text-white font-semibold mb-6">مستواك المبدئي هو: <span className="text-sky-500 dark:text-sky-400">{level}</span></p>
        <button onClick={() => onTestComplete(level)} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all">الانتقال إلى لوحة التحكم</button>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center mb-2">اختبار تحديد المستوى</h2>
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8">أجب على الأسئلة التالية لتحديد نقطة انطلاقك في رحلتك.</p>
            <div className="mb-8">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${((currentQuestion + 1) / placementTestQuestions.length) * 100}%` }}></div>
                </div>
                <p className="text-center mt-2 text-sm text-slate-500 dark:text-slate-400">السؤال {currentQuestion + 1} من {placementTestQuestions.length}</p>
            </div>
            <p className="text-xl text-slate-800 dark:text-white mb-6 text-center" dir="ltr">{placementTestQuestions[currentQuestion].question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {placementTestQuestions[currentQuestion].options.map(option => (
                    <button key={option} onClick={() => handleAnswer(option)} className="w-full text-left p-4 bg-slate-100 dark:bg-slate-800 border-2 border-transparent hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-slate-700 rounded-lg transition-all text-slate-700 dark:text-slate-200 font-medium">
                        {option}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

const Dashboard = ({ levels, onLevelSelect, streakCount, setPage, userLevel, lessonsData }) => {
    const totalLessons = Object.values(lessonsData).flat().length;
    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed).length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return (
        <div className="animate-fade-in z-10 relative">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">لوحة التحكم</h1>
                    <p className="text-slate-600 dark:text-slate-300">أهلاً بعودتك! رحلتك الكونية بانتظارك.</p>
                </div>
                <div className="flex items-center gap-2 text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                    <Flame size={20} />
                    <span className="font-bold text-lg">{streakCount}</span>
                    <span className="text-sm">أيام متتالية</span>
                </div>
            </div>

            <div className="mb-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-slate-700 dark:text-slate-200">التقدم الإجمالي</h2>
                    <span className="font-bold text-sky-500 dark:text-sky-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-sky-400 to-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                 <button onClick={() => setPage('review')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all">
                    <BrainCircuit className="text-green-500" size={32} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-center">مراجعة ذكية</span>
                </button>
                 <button onClick={() => setPage('writing')} className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all">
                    <Feather className="text-purple-500" size={32} />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-center">قسم الكتابة</span>
                </button>
            </div>


            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">اختر كوكباً (مستوى)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(levels).map(([id, level]) => (
                    <div key={id} onClick={() => onLevelSelect(id)} className={`p-6 rounded-2xl bg-gradient-to-br ${level.color} text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col justify-between`}>
                        <div>
                            <h3 className="text-2xl font-bold">{level.name}</h3>
                            <p className="opacity-80">{level.lessons} درساً</p>
                        </div>
                        {id === userLevel && <span className="mt-4 self-start bg-white/30 text-xs font-bold px-3 py-1 rounded-full">مستواك الحالي</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

const LessonsGrid = ({ levelId, lessons, onSelectLesson, onBack, userLevel }) => {
    const level = initialLevels[levelId];
    return (
        <div className="animate-fade-in z-10 relative">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 mb-6 font-semibold">
                <ArrowLeft size={18} />
                العودة إلى لوحة التحكم
            </button>
            <div className={`p-6 rounded-2xl bg-gradient-to-br ${level.color} text-white mb-8 shadow-lg`}>
                <h1 className="text-3xl font-bold">{level.name}</h1>
                <p>{levelId} - المستوى</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {lessons.map(lesson => (
                    <div key={lesson.id} onClick={() => onSelectLesson(lesson)} className="flex flex-col items-center cursor-pointer group">
                        <div className={`relative w-24 h-24 flex items-center justify-center rounded-full border-4 ${lesson.completed ? 'border-green-500' : 'border-slate-300 dark:border-slate-600'} bg-white dark:bg-slate-800 group-hover:scale-110 transition-transform`}>
                            <BookOpen size={40} className={`${lesson.completed ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'}`} />
                            {lesson.completed && <CheckCircle size={24} className="absolute -top-1 -right-1 text-white bg-green-500 rounded-full" />}
                        </div>
                        <p className="mt-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">{lesson.title}</p>
                        <div className="flex mt-1">
                            {[1, 2, 3].map(i => <Star key={i} size={14} className={i <= lesson.stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const LessonView = ({ lesson, onComplete, onBack }) => {
    const [view, setView] = useState('content');
    const [quiz, setQuiz] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState(null);

    const handleStartQuiz = async () => {
        setIsLoading(true);
        setError('');
        const prompt = `Create a short 5-question multiple-choice quiz about the essentials of English for an ${lesson.id} level. Provide a JSON object with a "questions" key. The value should be an array of objects, where each object has "question" (string), "options" (array of 4 strings), and "answer" (string).`;
        const schema = {
            type: "OBJECT",
            properties: {
                questions: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            question: { type: "STRING" },
                            options: { type: "ARRAY", items: { type: "STRING" } },
                            answer: { type: "STRING" }
                        },
                        required: ["question", "options", "answer"]
                    }
                }
            },
            required: ["questions"]
        };
        try {
            const result = await runGemini(prompt, schema);
            setQuiz(result);
            setView('quiz');
        } catch (e) {
            setError("عذرًا، حدث خطأ أثناء إنشاء الاختبار. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuizComplete = (score, total) => {
        setQuizResult({ score, total });
        setView('result');
    };

    const handleLessonCompletion = () => {
        onComplete(lesson.id, quizResult.score, quizResult.total);
    };

    const QuizView = ({ quiz, onQuizComplete }) => {
        const [current, setCurrent] = useState(0);
        const [score, setScore] = useState(0);
        const [selected, setSelected] = useState(null);
        const [isCorrect, setIsCorrect] = useState(null);

        const handleAnswer = (option) => {
            setSelected(option);
            if (option === quiz.questions[current].answer) {
                setIsCorrect(true);
                setScore(s => s + 1);
            } else {
                setIsCorrect(false);
            }
            setTimeout(() => {
                setSelected(null);
                setIsCorrect(null);
                if (current < quiz.questions.length - 1) {
                    setCurrent(c => c + 1);
                } else {
                    onQuizComplete(score + (option === quiz.questions[current].answer ? 1 : 0), quiz.questions.length);
                }
            }, 1500);
        };

        const getButtonClass = (option) => {
            if (!selected) return 'bg-slate-100 dark:bg-slate-800 hover:border-sky-500';
            if (option === quiz.questions[current].answer) return 'bg-green-200 dark:bg-green-900 border-green-500';
            if (option === selected && option !== quiz.questions[current].answer) return 'bg-red-200 dark:bg-red-900 border-red-500';
            return 'bg-slate-100 dark:bg-slate-800 opacity-60';
        };

        return (
            <div className="p-4 md:p-8 animate-fade-in z-10 relative max-w-2xl mx-auto">
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-2xl">
                    <p className="text-center text-slate-500 dark:text-slate-400 mb-4">السؤال {current + 1} من {quiz.questions.length}</p>
                    <p className="text-xl text-slate-800 dark:text-white mb-6 text-center">{quiz.questions[current].question}</p>
                    <div className="grid grid-cols-1 gap-4">
                        {quiz.questions[current].options.map(option => (
                            <button key={option} onClick={() => handleAnswer(option)} disabled={!!selected}
                                className={`w-full text-left p-4 border-2 rounded-lg transition-all text-slate-700 dark:text-slate-200 font-medium ${getButtonClass(option)}`}>
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="animate-fade-in z-10 relative">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 mb-6 font-semibold">
                <ArrowLeft size={18} />
                العودة إلى قائمة الدروس
            </button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">{lesson.title}</h1>
            
            {view === 'content' && (
                <div className="p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">محتوى الدرس</h2>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                        هنا سيتم عرض محتوى الدرس التفاعلي. يمكن أن يتضمن فيديوهات، نصوص، تمارين، وأكثر. حاليًا، سنستخدم نصًا مؤقتًا ومولد اختبار لغرض العرض.
                    </p>
                    <button onClick={handleStartQuiz} disabled={isLoading} className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <>🧠 ابدأ الاختبار</>}
                    </button>
                    {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                </div>
            )}

            {view === 'quiz' && quiz && <QuizView quiz={quiz} onQuizComplete={handleQuizComplete} />}
            
            {view === 'result' && (
                <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in">
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">اكتمل الاختبار!</h3>
                    <p className="text-lg text-slate-600 dark:text-slate-300">نتيجتك هي:</p>
                    <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">{quizResult.score} / {quizResult.total}</p>
                    {quizResult.score / quizResult.total >= 0.8 ? (
                        <p className="text-green-600 dark:text-green-400 font-semibold">🎉 رائع! لقد أتقنت هذا الدرس.</p>
                    ) : (
                        <p className="text-amber-600 dark:text-amber-400 font-semibold">👍 جيد! يمكنك مراجعة الدرس مرة أخرى لتعزيز فهمك.</p>
                    )}
                    <button onClick={handleLessonCompletion} className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all">إكمال الدرس والعودة</button>
                </div>
            )}
        </div>
    );
};

const WritingSection = ({ onBack }) => {
    const [text, setText] = useState('');
    const [correction, setCorrection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCorrect = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setCorrection(null);
        setError('');
        const prompt = `You are an expert English teacher. For the following text, provide a JSON object with three keys: 1. "correctedText": The original text with grammar/spelling mistakes fixed. 2. "improvedText": A more fluent, natural-sounding version. 3. "suggestions": An array of 3-4 specific, constructive suggestions. Each suggestion should be an object with two keys: "en" (the suggestion in English) and "ar" (a simple explanation of the suggestion in Arabic). Here is the text: "${text}"`;
        const schema = { type: "OBJECT", properties: { correctedText: { type: "STRING" }, improvedText: { type: "STRING" }, suggestions: { type: "ARRAY", items: { type: "OBJECT", properties: { en: { type: "STRING" }, ar: { type: "STRING" } }, required: ["en", "ar"] } } }, required: ["correctedText", "improvedText", "suggestions"] };
        try {
            const result = await runGemini(prompt, schema);
            setCorrection(result);
        } catch (e) {
            setError("عذرًا، حدث خطأ أثناء الاتصال. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
             <button onClick={onBack} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 mb-6 font-semibold">
                <ArrowLeft size={18} />
                العودة إلى لوحة التحكم
            </button>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3"><Feather /> قسم الكتابة الإبداعي</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">مساحة حرة للكتابة. اكتب أي شيء، ودعنا نساعدك على التحسين.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصك هنا باللغة الإنجليزية..." className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"></textarea>
                    <button onClick={handleCorrect} disabled={isLoading} className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> صحح وحسّن النص</>}
                    </button>
                </div>
                <div className="space-y-4">
                    {isLoading && <div className="flex items-center justify-center h-full"><LoaderCircle className="animate-spin text-sky-500" size={40} /></div>}
                    {error && <div className="p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>}
                    {correction && (
                        <div className="space-y-4 animate-fade-in">
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">النص المُحسَّن:</h3>
                                <p className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-green-800 dark:text-green-200">{correction.improvedText}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">اقتراحات للتحسين:</h3>
                                <ul className="space-y-2">
                                    {correction.suggestions.map((s, i) => (
                                        <li key={i} className="p-3 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">{s.en}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{s.ar}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- المكون الرئيسي للتطبيق ---
export default function App() {
  const [page, setPage] = usePersistentState('stellarSpeakPage', 'welcome');
  const [userLevel, setUserLevel] = usePersistentState('stellarSpeakUserLevel', null);
  const [lessonsData, setLessonsData] = usePersistentState('stellarSpeakLessonsData', initialLessonsData);
  const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
  const [isDarkMode, setIsDarkMode] = usePersistentState('stellarSpeakIsDarkMode', true);
  
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [certificateToShow, setCertificateToShow] = useState(null);

  // تم حل مشكلة الشاشة البيضاء عبر معالجة التحميل الأولية في usePersistentState
  // لا حاجة لمتغير isInitialLoad بعد الآن

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Streak Logic
    const today = new Date().toDateString();
    if (streakData.lastVisit !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (streakData.lastVisit === yesterday.toDateString()) {
        setStreakData(prev => ({ count: prev.count + 1, lastVisit: today }));
      } else {
        // لا تعيد العداد للصفر إذا كان اليوم هو أول زيارة
        if (streakData.lastVisit !== null) {
            setStreakData({ count: 1, lastVisit: today });
        } else {
            setStreakData({ count: 1, lastVisit: today });
        }
      }
    }
  }, []); // يعمل مرة واحدة عند تحميل التطبيق


  const handleCompleteLesson = (lessonId, score, total) => {
    const levelId = lessonId.substring(0, 2);
    const stars = Math.max(1, Math.round((score / total) * 3));
    
    let updatedLessons;
    setLessonsData(prevData => {
      updatedLessons = prevData[levelId].map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true, stars: Math.max(lesson.stars || 0, stars) } : lesson
      );
      return { ...prevData, [levelId]: updatedLessons };
    });

    // استخدام متغير `updatedLessons` المحدث مباشرة
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
  const handleBackToDashboard = () => { setSelectedLevelId(null); setCurrentLesson(null); setPage('dashboard'); };
  const handleBackToLessons = () => { setCurrentLesson(null); setPage('lessons'); };

  const renderPage = () => {
    // إذا لم يكن المستخدم قد حدد مستواه بعد (مثلاً، مستخدم جديد)
    // نعرض له شاشة البداية ثم اختبار تحديد المستوى
    if (userLevel === null && page !== 'welcome' && page !== 'placementTest') {
        setPage('welcome');
    }

    switch (page) {
      case 'welcome':
        return <WelcomeScreen onStart={() => setPage('placementTest')} />;
      case 'placementTest':
        return <PlacementTest onTestComplete={handleTestComplete} />;
      case 'dashboard':
        return <Dashboard 
                  levels={initialLevels} 
                  onLevelSelect={handleLevelSelect} 
                  streakCount={streakData.count} 
                  setPage={setPage}
                  userLevel={userLevel}
                  lessonsData={lessonsData}
               />;
      case 'lessons':
        return <LessonsGrid 
                  levelId={selectedLevelId} 
                  lessons={lessonsData[selectedLevelId]} 
                  onSelectLesson={handleSelectLesson} 
                  onBack={handleBackToDashboard}
                  userLevel={userLevel}
                />;
      case 'lessonContent':
        return <LessonView 
                  lesson={currentLesson} 
                  onComplete={handleCompleteLesson} 
                  onBack={handleBackToLessons} 
               />;
      case 'writing':
        return <WritingSection onBack={handleBackToDashboard} />;
    //   case 'review':
    //     return <ReviewSection onBack={handleBackToDashboard} completedLessons={Object.values(lessonsData).flat().filter(l => l.completed)} />;
      default:
        return <WelcomeScreen onStart={() => setPage('placementTest')} />;
    }
  };

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-900' : 'bg-slate-50'}`}>
      <div className="absolute top-0 right-0 p-4 z-50">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {isDarkMode ? <Sun /> : <Moon />}
          </button>
      </div>
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
}

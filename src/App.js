import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Feather, Award, Sun, Moon, FileText, Download, MessageSquare, BrainCircuit, Library, Sparkles, Wand2, ArrowLeft, CheckCircle, LoaderCircle, XCircle, RefreshCw } from 'lucide-react';

// --- بيانات التطبيق ---
const initialLevels = {
  A1: { name: "مدينة المبتدئين", icon: "A1", lessons: 5, color: "bg-sky-500" },
  A2: { name: "واحة الأساسيات", icon: "A2", lessons: 5, color: "bg-teal-500" },
  B1: { name: "جسر المتوسطين", icon: "B1", lessons: 5, color: "bg-amber-500" },
  B2: { name: "هضبة الطلاقة", icon: "B2", lessons: 5, color: "bg-orange-500" },
  C1: { name: "قمة الإتقان", icon: "C1", lessons: 5, color: "bg-red-500" },
};

const initialLessonsData = {
    A1: [
        { id: 'A1-1', title: 'Grammar: Verb “to be” (am/is/are) – pronouns', completed: false },
        { id: 'A1-2', title: 'Vocabulary: Greetings and introductions', completed: false },
        { id: 'A1-3', title: 'Grammar: Plurals', completed: false },
        { id: 'A1-4', title: 'Vocabulary: Numbers, colors, shapes', completed: false },
        { id: 'A1-5', title: 'Grammar: Articles (a/an/the)', completed: false },
    ],
    A2: Array.from({ length: 5 }, (_, i) => ({ id: `A2-${i + 1}`, title: `A2 Lesson ${i + 1}`, completed: false })),
    B1: Array.from({ length: 5 }, (_, i) => ({ id: `B1-${i + 1}`, title: `B1 Lesson ${i + 1}`, completed: false })),
    B2: Array.from({ length: 5 }, (_, i) => ({ id: `B2-${i + 1}`, title: `B2 Lesson ${i + 1}`, completed: false })),
    C1: Array.from({ length: 5 }, (_, i) => ({ id: `C1-${i + 1}`, title: `C1 Lesson ${i + 1}`, completed: false })),
};

const initialReadingMaterials = [
    { id: 1, type: 'Story', title: 'The Lost Compass', content: "In a small village nestled between rolling hills, a young boy named Leo found an old brass compass. It didn't point north. Instead, it whispered directions to forgotten places and lost memories. One day, it led him to an ancient oak tree with a hidden door at its base. He opened it, and a wave of starlight and forgotten songs washed over him. He realized the compass didn't find places, but moments of wonder. He learned that the greatest adventures are not on a map, but in the heart.", questions: ["What does the compass guide Leo to?", "What is the main lesson Leo learned?", "How would you describe the mood of the story?"] },
    { id: 2, type: 'Article', title: 'The Power of Sleep', content: "Sleep is not just a period of rest; it's a critical biological process. During sleep, our brains consolidate memories, process information, and clear out metabolic waste. A lack of quality sleep can impair cognitive function, weaken the immune system, and affect our mood. Scientists recommend 7-9 hours of sleep for adults for optimal health. It's as important as a balanced diet and regular exercise. Prioritizing sleep is an investment in your physical and mental well-being.", questions: ["What are three benefits of sleep mentioned in the article?", "Why is sleep compared to diet and exercise?", "How can you improve your own sleep habits based on this text?"] },
];

// --- Gemini API Helper ---
const apiKey = ""; 
async function runGemini(prompt, schema) {
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

// --- المكونات الفرعية ---

const WelcomeScreen = ({ onStart }) => (
  <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
    <BrainCircuit size={80} className="text-sky-500 dark:text-sky-400 mb-6" />
    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">رحلة عبور اللغة</h1>
    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg">منصة متكاملة تأخذك في رحلة منظمة من A1 إلى C1، مع التركيز على الفهم والتعبير.</p>
    <button onClick={onStart} className="bg-sky-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-sky-600 transition-all duration-300 transform hover:scale-105 shadow-lg">ابدأ رحلتك الآن ✨</button>
  </div>
);

const Dashboard = ({ userLevel, onLevelSelect, lessonsData }) => {
    return (
      <div className="p-4 md:p-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">مسارات التعلم (المدن اللغوية)</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-8">رحلتك تبدأ هنا. كل مدينة تمثل مستوى جديداً من الإتقان.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(initialLevels).map(([key, level]) => {
            const isLocked = Object.keys(initialLevels).indexOf(key) > Object.keys(initialLevels).indexOf(userLevel);
            const levelLessons = lessonsData[key] || [];
            const completedCount = levelLessons.filter(l => l.completed).length;
            const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
            return (
              <div key={key} onClick={() => !isLocked && onLevelSelect(key)}
                className={`p-6 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 ${isLocked ? 'bg-slate-200 dark:bg-slate-700 cursor-not-allowed' : `${level.color} text-white cursor-pointer`}`}>
                <div className="flex justify-between items-start">
                  <div className="text-5xl font-bold">{level.icon}</div>
                  {isLocked && <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded-full">🔒 مغلق</span>}
                </div>
                <h3 className="text-2xl font-bold mt-4">{level.name}</h3>
                <p className="opacity-80 mt-1">{level.lessons} درسًا</p>
                {!isLocked && (
                  <div className="mt-4">
                    <div className="w-full bg-white/30 rounded-full h-2.5"><div className="bg-white h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                    <p className="text-sm mt-1 opacity-90">{Math.round(progress)}% مكتمل</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
};

const LessonView = ({ levelId, onBack, onSelectLesson, lessons }) => {
    const level = initialLevels[levelId];
    const completedCount = lessons.filter(l => l.completed).length;
    const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى المسارات</button>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-lg ${level.color} flex items-center justify-center text-white text-4xl font-bold`}>{level.icon}</div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{level.name}</h1>
                    <p className="text-slate-600 dark:text-slate-300">المستوى: {levelId}</p>
                </div>
            </div>
             <div className="mb-8">
                <p className="text-slate-700 dark:text-slate-200 mb-2">التقدم: {Math.round(progress)}%</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className={`${level.color} h-4 rounded-full`} style={{ width: `${progress}%` }}></div></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">قائمة الدروس</h2>
            <div className="space-y-3">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex items-center justify-between transition-all hover:shadow-md hover:scale-[1.02]">
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${lesson.completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{lesson.completed ? <CheckCircle size={20}/> : lesson.id.split('-')[1]}</div>
                            <span className={`font-medium ${lesson.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{lesson.title}</span>
                        </div>
                        <button onClick={() => onSelectLesson(lesson)} className="text-sm font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300">ابدأ</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuizView = ({ quiz, onQuizComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const handleAnswer = (option) => {
        if (isAnswered) return;
        setSelectedOption(option);
        setIsAnswered(true);
        if (option === quiz[currentQuestionIndex].correctAnswer) {
            setScore(score + 1);
        }
    };
    const handleNext = () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            onQuizComplete(score, quiz.length);
        }
    };
    const getButtonClass = (option) => {
        if (!isAnswered) return 'bg-white dark:bg-slate-700 hover:bg-sky-100 dark:hover:bg-slate-600';
        if (option === quiz[currentQuestionIndex].correctAnswer) return 'bg-green-200 dark:bg-green-800 border-green-500';
        if (option === selectedOption) return 'bg-red-200 dark:bg-red-800 border-red-500';
        return 'bg-slate-100 dark:bg-slate-800 opacity-60';
    };
    const currentQuestion = quiz[currentQuestionIndex];
    return (
        <div className="animate-fade-in">
            <p className="text-center font-semibold text-slate-600 dark:text-slate-300 mb-2">السؤال {currentQuestionIndex + 1} من {quiz.length}</p>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h3 className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px]">{currentQuestion.question}</h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                        <button key={i} onClick={() => handleAnswer(option)} disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${getButtonClass(option)}`}>
                            {option}
                        </button>
                    ))}
                </div>
                {isAnswered && (
                    <button onClick={handleNext} className="mt-6 w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all">
                        {currentQuestionIndex < quiz.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                    </button>
                )}
            </div>
        </div>
    );
};

const LessonContent = ({ lesson, onBack, onCompleteLesson }) => {
    const [lessonContent, setLessonContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [view, setView] = useState('lesson'); // lesson, quiz, result
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    useEffect(() => {
        const generateLessonContent = async () => {
            setIsLoading(prev => ({ ...prev, lesson: true }));
            setError('');
            const level = lesson.id.substring(0, 2);
            const prompt = `You are an expert English teacher. For the lesson titled "${lesson.title}", generate a JSON object for a ${level}-level student with two keys: "explanation" (a clear explanation) and "examples" (an array of exactly 15 practical example sentences).`;
            const schema = { type: "OBJECT", properties: { explanation: { type: "STRING" }, examples: { type: "ARRAY", items: { type: "STRING" } } }, required: ["explanation", "examples"] };
            try {
                const result = await runGemini(prompt, schema);
                setLessonContent(result);
            } catch (e) { setError('عذرًا، فشل تحميل محتوى الدرس.'); } 
            finally { setIsLoading(prev => ({ ...prev, lesson: false })); }
        };
        generateLessonContent();
    }, [lesson]);
    const handleStartQuiz = async () => {
        setIsLoading(prev => ({ ...prev, quiz: true }));
        setError('');
        const prompt = `Based on the English lesson about "${lesson.title}" and its explanation "${lessonContent.explanation}", create a JSON object containing a single key "quiz". The value should be an array of 5 multiple-choice questions. Each question object must have three keys: "question" (string), "options" (an array of 4 strings), and "correctAnswer" (a string that exactly matches one of the options).`;
        const schema = { type: "OBJECT", properties: { quiz: { type: "ARRAY", items: { type: "OBJECT", properties: { question: { type: "STRING" }, options: { type: "ARRAY", items: { type: "STRING" } }, correctAnswer: { type: "STRING" } }, required: ["question", "options", "correctAnswer"] } } }, required: ["quiz"] };
        try {
            const result = await runGemini(prompt, schema);
            setQuiz(result.quiz);
            setView('quiz');
        } catch (e) { setError('عذرًا، فشل إنشاء الاختبار.'); } 
        finally { setIsLoading(prev => ({ ...prev, quiz: false })); }
    };
    const handleQuizComplete = (score, total) => {
        setQuizResult({ score, total });
        setView('result');
    };
    const handleLessonCompletion = () => {
        onCompleteLesson(lesson.id);
        onBack();
    };
    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <button onClick={onBack} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">{lesson.title}</h1>
            {isLoading.lesson && <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800 p-10 rounded-xl shadow-md"><LoaderCircle className="animate-spin text-sky-500" size={48} /><p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">يقوم Gemini بإعداد الدرس لك...</p></div>}
            {error && !isLoading.lesson && <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert"><p className="font-bold">حدث خطأ</p><p>{error}</p></div>}
            {view === 'lesson' && lessonContent && (
                <div className="animate-fade-in">
                    <div className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold">Explanation</h2><p>{lessonContent.explanation}</p>
                        <h3 className="text-xl font-bold mt-6">Examples</h3><ul className="list-decimal pl-5 space-y-2">{lessonContent.examples.map((ex, i) => <li key={i}>{ex}</li>)}</ul>
                    </div>
                    <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">🧠 اختبر معلوماتك</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">هل أنت مستعد لاختبار فهمك لهذا الدرس؟</p>
                        <button onClick={handleStartQuiz} disabled={isLoading.quiz} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400">
                            {isLoading.quiz ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> ابدأ الاختبار</>}
                        </button>
                    </div>
                </div>
            )}
            {view === 'quiz' && quiz && <QuizView quiz={quiz} onQuizComplete={handleQuizComplete} />}
            {view === 'result' && (
                <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md text-center animate-fade-in">
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">اكتمل الاختبار!</h3>
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

const WritingSection = () => {
    const [text, setText] = useState('');
    const [correction, setCorrection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCorrect = async () => {
        if (!text.trim()) return;
        setIsLoading(true); setCorrection(null); setError('');
        const prompt = `You are an expert English teacher. Please correct the following text from a language learner. Provide three things in a JSON object: 1. "correctedText": The original text with grammar and spelling mistakes fixed. 2. "improvedText": A more fluent, natural-sounding version of the text. 3. "suggestions": An array of 3-4 specific, constructive suggestions for improvement, explaining the 'why' behind the changes. Here is the text: "${text}"`;
        const schema = { type: "OBJECT", properties: { correctedText: { type: "STRING" }, improvedText: { type: "STRING" }, suggestions: { type: "ARRAY", items: { type: "STRING" } } }, required: ["correctedText", "improvedText", "suggestions"] };
        try {
            const result = await runGemini(prompt, schema);
            setCorrection(result);
        } catch (e) { setError("عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى."); } 
        finally { setIsLoading(false); }
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-3"><Feather /> قسم الكتابة الإبداعي</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">مساحة حرة للكتابة. اكتب أي شيء، ودع Gemini يساعدك على التحسين.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب نصك هنا باللغة الإنجليزية..." className="w-full h-64 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"></textarea>
                    <button onClick={handleCorrect} disabled={isLoading} className="mt-4 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2">
                        {isLoading ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> صحح وحسّن النص</>}
                    </button>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md min-h-[320px]">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">نتائج تحليل Gemini</h3>
                    {isLoading && <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Wand2 className="animate-pulse" /> يقوم Gemini بتحليل النص...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {correction && (
                        <div className="animate-fade-in space-y-4">
                            <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">النص المُصحح:</h4><p className="text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 p-3 rounded-md">{correction.correctedText}</p></div>
                            <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">نسخة مُحسّنة:</h4><p className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/50 p-3 rounded-md">{correction.improvedText}</p></div>
                            <div><h4 className="font-semibold text-slate-700 dark:text-slate-200">اقتراحات للتحسين:</h4><ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">{correction.suggestions.map((s, i) => <li key={i}>{s}</li>)}</ul></div>
                        </div>
                    )}
                    {!isLoading && !correction && !error && <p className="text-slate-500 dark:text-slate-400">ستظهر النتائج هنا بعد التصحيح.</p>}
                </div>
            </div>
        </div>
    );
};

const ReadingCenter = () => {
    const [materials, setMaterials] = useState(initialReadingMaterials);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [genre, setGenre] = useState('Sci-Fi');

    const handleGenerateStory = async () => {
        setIsGenerating(true); setError('');
        const prompt = `You are a creative storyteller. Generate a short story for a B1-level English language learner. The story should be about 150 words long and belong to the "${genre}" genre. Also, provide 3 open-ended comprehension questions about the story. Return the result as a JSON object with three keys: "title", "content", and "questions" (an array of strings).`;
        const schema = { type: "OBJECT", properties: { title: { type: "STRING" }, content: { type: "STRING" }, questions: { type: "ARRAY", items: { type: "STRING" } } }, required: ["title", "content", "questions"] };
        try {
            const result = await runGemini(prompt, schema);
            const newStory = { id: Date.now(), type: 'Story', ...result };
            setMaterials(prev => [newStory, ...prev]);
        } catch (e) { setError("فشلت عملية توليد القصة. يرجى المحاولة مرة أخرى."); } 
        finally { setIsGenerating(false); }
    };

    if (selectedMaterial) {
        return (
            <div className="p-4 md:p-8 animate-fade-in">
                <button onClick={() => setSelectedMaterial(null)} className="mb-6 text-sky-500 dark:text-sky-400 hover:underline flex items-center"><ArrowLeft size={16} className="mr-1" /> العودة إلى المكتبة</button>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{selectedMaterial.title}</h2>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${selectedMaterial.type === 'Story' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'}`}>{selectedMaterial.type}</span>
                <div className="prose dark:prose-invert max-w-none mt-6 text-lg text-left leading-relaxed bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md"><p>{selectedMaterial.content}</p></div>
                <div className="mt-8"><h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">أسئلة للتفكير 🤔</h3><div className="space-y-4">{selectedMaterial.questions.map((q, i) => (<div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm"><p className="text-slate-700 dark:text-slate-200">{q}</p></div>))}</div></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div><h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">📖 مركز القراءة والتأمل</h1><p className="text-slate-600 dark:text-slate-300">اقرأ قصصًا ومقالات متنوعة، أو قم بتوليد محتوى جديد بنفسك.</p></div>
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm">
                    <select value={genre} onChange={e => setGenre(e.target.value)} className="bg-transparent focus:outline-none"><option>Sci-Fi</option><option>Mystery</option><option>Adventure</option><option>Comedy</option></select>
                    <button onClick={handleGenerateStory} disabled={isGenerating} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition-all duration-300 disabled:bg-slate-400 flex items-center justify-center gap-2">
                         {isGenerating ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={16} /> توليد قصة</>}
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map(material => (<div key={material.id} onClick={() => setSelectedMaterial(material)} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${material.type === 'Story' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300'}`}>{material.type}</span>
                    <h3 className="text-xl font-bold mt-3 text-slate-800 dark:text-slate-100">{material.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">{material.content}</p>
                </div>))}
            </div>
        </div>
    );
};

const Certificate = () => {
    return (
        <div className="p-4 md:p-8 animate-fade-in text-center flex flex-col items-center">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">🏆 الشهادات</h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6">عند اجتياز كل "بوابة عبور"، ستحصل على شهادة هنا.</p>
            <div className="w-full max-w-2xl aspect-[1.414] bg-white dark:bg-slate-800 border-4 border-slate-300 dark:border-slate-700 p-8 rounded-lg shadow-2xl relative flex items-center justify-center">
                <p className="text-slate-500 dark:text-slate-400">أكمل مستوى B1 للحصول على شهادتك الأولى!</p>
            </div>
        </div>
    );
};


// --- المكون الرئيسي للتطبيق ---
export default function App() {
  const [page, setPage] = useState('welcome');
  const [userLevel, setUserLevel] = useState('A1');
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lessonsDataState, setLessonsDataState] = useState(initialLessonsData);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const handleCompleteLesson = (lessonId) => {
      const levelId = lessonId.substring(0, 2);
      setLessonsDataState(prevData => ({
          ...prevData,
          [levelId]: prevData[levelId].map(lesson => 
              lesson.id === lessonId ? { ...lesson, completed: true } : lesson
          )
      }));
  };

  const handleLevelSelect = (levelId) => { setSelectedLevelId(levelId); setPage('lessons'); };
  const handleSelectLesson = (lesson) => { setCurrentLesson(lesson); setPage('lessonContent'); };
  const handleBackToDashboard = () => { setSelectedLevelId(null); setCurrentLesson(null); setPage('dashboard'); }
  const handleBackToLessons = () => { setCurrentLesson(null); setPage('lessons'); }

  const renderPage = () => {
    switch (page) {
      case 'welcome': return <WelcomeScreen onStart={() => setPage('dashboard')} />;
      case 'dashboard': return <Dashboard userLevel={userLevel} onLevelSelect={handleLevelSelect} lessonsData={lessonsDataState} />;
      case 'lessons': return <LessonView levelId={selectedLevelId} onBack={handleBackToDashboard} onSelectLesson={handleSelectLesson} lessons={lessonsDataState[selectedLevelId]} />;
      case 'lessonContent': return <LessonContent lesson={currentLesson} onBack={handleBackToLessons} onCompleteLesson={handleCompleteLesson} />;
      case 'writing': return <WritingSection />;
      case 'reading': return <ReadingCenter />;
      case 'certificate': return <Certificate />;
      default: return <WelcomeScreen onStart={() => setPage('dashboard')} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: BookOpen },
    { id: 'writing', label: 'كتابة', icon: Feather },
    { id: 'reading', label: 'قراءة', icon: Library },
    { id: 'certificate', label: 'الشهادات', icon: Award },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans">
        <header className="sticky top-0 z-10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-sm">
          <nav className="container mx-auto px-4 md:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleBackToDashboard}><BrainCircuit className="text-sky-500 dark:text-sky-400" size={28} /><span className="text-xl font-bold text-slate-800 dark:text-slate-100">رحلة عبور</span></div>
            <div className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id)} className={`flex items-center gap-2 font-semibold transition-colors ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 dark:text-sky-400' : page === item.id ? 'text-sky-500 dark:text-sky-400' : 'text-slate-600 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400'}`}><item.icon size={20} />{item.label}</button>
              ))}
            </div>
            <div className="flex items-center gap-4"><button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button></div>
          </nav>
        </header>
        <main className="container mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">{renderPage()}</main>
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-2">
            <div className="flex justify-around items-center">
            {navItems.map(item => (
                <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors w-20 ${page.startsWith('lesson') && item.id === 'dashboard' ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/50' : page === item.id ? 'text-sky-500 bg-sky-50 dark:bg-sky-900/50' : 'text-slate-600 dark:text-slate-300'}`}><item.icon size={22} /><span className="text-xs font-medium">{item.label}</span></button>
              ))}
            </div>
        </footer>
      </div>
    </div>
  );
}

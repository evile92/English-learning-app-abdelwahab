import React, { useState, useEffect } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react';
import QuizView from './QuizView';

// Gemini API Helper (نحتاجه هنا)
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

export default LessonContent;

// src/components/LessonContent.js

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react';
import QuizView from './QuizView';
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';

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

const LessonContent = () => {
    const { currentLesson, handleBackToLessons, handleCompleteLesson } = useAppContext();

    const [lessonContent, setLessonContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const generateLessonContent = useCallback(async () => {
        if (!currentLesson) return;
        // setView('lesson'); // <--- ✅ تم حذف هذا السطر لإصلاح المشكلة
        setLessonContent(null);
        setQuiz(null);
        setIsLoading(prev => ({ ...prev, lesson: true }));
        setError('');
        
        const manualContent = manualLessonsContent[currentLesson.id];
        if (manualContent) {
            setTimeout(() => {
                setLessonContent(manualContent);
                setIsLoading(prev => ({ ...prev, lesson: false }));
            }, 300);
        } else {
            const level = currentLesson.id.substring(0, 2);
            const prompt = `You are an expert English teacher. For the lesson titled "${currentLesson.title}" for a ${level}-level student, generate a JSON object...`;
            const schema = { /* schema */ };
            try {
                const result = await runGemini(prompt, schema);
                setLessonContent(result);
            } catch (e) {
                setError('عذرًا، فشل تحميل محتوى الدرس. تأكد من اتصالك بالإنترنت.');
            } finally {
                setIsLoading(prev => ({ ...prev, lesson: false }));
            }
        }
    }, [currentLesson]);

    useEffect(() => {
        // --- تعديل بسيط هنا لضمان عدم إعادة التحميل إلا عند الضرورة ---
        if (currentLesson && !lessonContent) {
            generateLessonContent();
        } else if (!currentLesson) {
            handleBackToLessons();
        }
    }, [currentLesson, lessonContent, handleBackToLessons, generateLessonContent]);
    
    const handleStartQuiz = async () => {
        if (!lessonContent) return;
    
        setIsLoading(prev => ({ ...prev, quiz: true }));
        setError('');
    
        const lessonTextContent = `Explanation: ${lessonContent.explanation.en}. Examples: ${lessonContent.examples.map(ex => ex.en || ex).join(' ')}`;
        const prompt = `Based STRICTLY on the following lesson content: "${lessonTextContent}", create a JSON object for a quiz. The key "quiz" should be an array of EXACTLY 8 multiple-choice questions designed to test understanding of the main concepts. Each question object must have "question", "options" (an array of 4 strings), and "correctAnswer".`;
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
    
    const handleLessonCompletion = async () => {
        setIsCompleting(true);
        await handleCompleteLesson(currentLesson.id, quizResult.score, quizResult.total);
    };

    if (!currentLesson) {
        return null;
    }
  
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToLessons} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words" dir="ltr">{currentLesson.title}</h1>
            
            {isLoading.lesson && <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-10 rounded-2xl shadow-lg"><LoaderCircle className="animate-spin text-sky-500 dark:text-sky-400" size={48} /><p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">نقوم بإعداد الدرس لك...</p></div>}
      
            {error && !isLoading.lesson && 
                <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert">
                    <p className="font-bold">حدث خطأ</p>
                    <p>{error}</p>
                    <button onClick={generateLessonContent} className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600">إعادة المحاولة</button>
                </div>
            }
            
            {view === 'lesson' && lessonContent && (
                <div className="animate-fade-in">
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        <h2 dir="ltr" className="text-left text-2xl font-bold text-slate-800 dark:text-white">Explanation</h2>
                        <p dir="ltr" className="text-left" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.en}</p>
                        <div dir="rtl" className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border-r-4 border-sky-500">
                            <p className="text-right text-slate-700 dark:text-slate-200" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.ar}</p>
                        </div>
                    </div>

                    <div className="mt-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-left">Examples</h3>
                        <div className="space-y-4">
                            {lessonContent.examples.map((ex, i) => {
                                const parts = ex.split(' - ');
                                let englishPart = ex;
                                let arabicPart = '';

                                if (parts.length > 1) {
                                  arabicPart = parts.pop(); 
                                  englishPart = parts.join(' - ');
                                }

                                return (
                                  <div key={i} dir="ltr" className="flex items-start gap-3 border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                                    <span className="font-bold text-slate-500 dark:text-slate-400 pt-1">{i + 1}.</span>
                                    <div className="flex-1">
                                      <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200 m-0" style={{ whiteSpace: 'pre-wrap' }}>
                                        {englishPart}
                                      </p>
                                      {arabicPart && (
                                        <p dir="rtl" className="text-left text-sm text-slate-500 dark:text-slate-400 m-0 pt-1" style={{ whiteSpace: 'pre-wrap' }}>
                                            {arabicPart}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">🧠 اختبر معلوماتك</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">هل أنت مستعد لاختبار فهمك لهذا الدرس؟</p>
                        <button onClick={handleStartQuiz} disabled={isLoading.quiz} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"> {isLoading.quiz ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> ابدأ الاختبار</>} </button>
                    </div>
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
                    <button 
                        onClick={handleLessonCompletion} 
                        disabled={isCompleting}
                        className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2"
                    >
                        {isCompleting ? <LoaderCircle className="animate-spin" /> : 'إكمال الدرس والعودة'}
                    </button> 
                </div> 
            )}
        </div>
    );
};

export default LessonContent;

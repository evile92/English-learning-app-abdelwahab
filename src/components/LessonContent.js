// src/components/LessonContent.js

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, LoaderCircle, Sparkles } from 'lucide-react';
import QuizView from './QuizView';
import { manualLessonsContent } from '../data/manualLessons';
import { useAppContext } from '../context/AppContext';

// ... دالة runGemini تبقى كما هي ...
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

    // ... كل الـ state يبقى كما هو ...
    const [lessonContent, setLessonContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    // ... كل الدوال تبقى كما هي ...
    const generateLessonContent = useCallback(async () => {
        if (!currentLesson) return;
        setView('lesson');
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
             // ... logic for Gemini API
        }
    }, [currentLesson]);

    useEffect(() => {
        if (currentLesson && view === 'lesson') {
            generateLessonContent();
        } else if (!currentLesson) {
            handleBackToLessons();
        }
    }, [currentLesson, view, handleBackToLessons, generateLessonContent]);

    const handleStartQuiz = async () => { /* ... */ };
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
            
            {isLoading.lesson && <div className="flex flex-col items-center justify-center ...">Loading...</div>}
            {error && !isLoading.lesson && <div className="bg-red-100 ...">Error...</div>}
            
            {view === 'lesson' && lessonContent && (
                <div className="animate-fade-in">
                    {/* ========================(بداية التعديل الهيكلي)======================== */}
                    
                    {/* الحاوية الأولى: للشرح فقط، وستأخذ تنسيق prose */}
                    <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        <h2 dir="ltr" className="text-left text-2xl font-bold text-slate-800 dark:text-white">Explanation</h2>
                        <p dir="ltr" className="text-left" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.en}</p>
                        <div dir="rtl" className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg border-r-4 border-sky-500">
                            <p className="text-right text-slate-700 dark:text-slate-200" style={{ whiteSpace: 'pre-wrap' }}>{lessonContent.explanation.ar}</p>
                        </div>
                    </div>

                    {/* الحاوية الثانية: للأمثلة فقط، بدون تنسيق prose لتجنب التعارض */}
                    <div className="mt-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        <h3 dir="ltr" className="text-left text-xl font-bold text-slate-800 dark:text-white mb-4">Examples</h3>
                        <ol className="list-decimal list-inside space-y-4">
                            {lessonContent.examples.map((ex, i) => {
                                const parts = ex.split(' - ');
                                const englishPart = parts[0];
                                const arabicPart = parts.slice(1).join(' - ');
                                return (
                                  <li key={i} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0">
                                    <p dir="ltr" className="text-left text-slate-800 dark:text-slate-200 m-0">{englishPart}</p>
                                    {arabicPart && (
                                      <p dir="rtl" className="text-right text-sm text-slate-500 dark:text-slate-400 m-0 pt-1">
                                          {arabicPart}
                                      </p>
                                    )}
                                  </li>
                                );
                            })}
                        </ol>
                    </div>

                    {/* ========================(نهاية التعديل الهيكلي)======================== */}

                    <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">🧠 اختبر معلوماتك</h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">هل أنت مستعد لاختبار فهمك لهذا الدرس؟</p>
                        <button onClick={handleStartQuiz} disabled={isLoading.quiz} className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"> {isLoading.quiz ? <LoaderCircle className="animate-spin" /> : <><Sparkles size={18} /> ابدأ الاختبار</>} </button>
                    </div>
                </div>
            )}

            {view === 'quiz' && quiz && <QuizView quiz={quiz} onQuizComplete={handleQuizComplete} />}
      
            {view === 'result' && ( 
                <div className="mt-8 p-6 ..."> 
                    {/* ... Result View JSX ... */}
                </div> 
            )}
        </div>
    );
};

export default LessonContent;

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
    const [lessonContent, setLessonContent] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [view, setView] = useState('lesson');
    const [isLoading, setIsLoading] = useState({ lesson: true, quiz: false });
    const [error, setError] = useState('');
    const [quizResult, setQuizResult] = useState({ score: 0, total: 0 });
    const [isCompleting, setIsCompleting] = useState(false);

    const generateLessonContent = useCallback(async () => {
        // ... (هذه الدالة تبقى كما هي)
    }, [currentLesson]);

    useEffect(() => {
        // ... (هذا الكود يبقى كما هو)
    }, [currentLesson, view, handleBackToLessons, generateLessonContent]);

    const handleStartQuiz = async () => { /* ... */ };
    const handleQuizComplete = (score, total) => { setQuizResult({ score, total }); setView('result'); };
    const handleLessonCompletion = async () => { /* ... */ };

    if (!currentLesson) {
        return null;
    }
  
    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToLessons} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى قائمة الدروس</button>
            <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4 break-words" dir="ltr">{currentLesson.title}</h1>
            
            {/* ... كود التحميل والخطأ يبقى كما هو ... */}
            
            {view === 'lesson' && lessonContent && (
                <div className="animate-fade-in">
                    {/* الشرح سيبقى داخل حاوية prose */}
                    <div className="prose dark:prose-invert max-w-none text-lg ...">
                        {/* ... كود الشرح هنا ... */}
                    </div>

                    {/* ========================(بداية التعديل الجذري والنهائي)======================== */}
                    <div className="mt-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-left">Examples</h3>
                        <div className="space-y-4">
                            {lessonContent.examples.map((ex, i) => {
                                const parts = ex.split(' - ');
                                const englishPart = parts[0];
                                const arabicPart = parts.slice(1).join(' - ');
                                return (
                                  <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-4 last:border-b-0">
                                    <p className="text-lg text-slate-800 dark:text-slate-200 m-0 text-left">
                                      <span className="font-bold text-slate-500">{i + 1}. </span>
                                      {englishPart}
                                    </p>
                                    {arabicPart && (
                                      <p className="text-sm text-slate-500 dark:text-slate-400 m-0 pt-1 text-left">
                                          {arabicPart}
                                      </p>
                                    )}
                                  </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* ========================(نهاية التعديل الجذري والنهائي)======================== */}

                    <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 ...">
                        {/* ... زر الاختبار ... */}
                    </div>
                </div>
            )}

            {/* ... بقية الكود ... */}
        </div>
    );
};

export default LessonContent;

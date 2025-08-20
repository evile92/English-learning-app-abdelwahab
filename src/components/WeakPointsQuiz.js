// src/components/WeakPointsQuiz.js

import React, { useState, useEffect } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const WeakPointsQuiz = () => {
    const { 
        weakPointsQuiz, 
        handleWeakPointsQuizComplete 
    } = useAppContext();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (!weakPointsQuiz || weakPointsQuiz.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <LoaderCircle className="animate-spin text-sky-500" size={64} />
                <h1 className="text-2xl font-bold mt-6 text-slate-800 dark:text-white">
                    جارِ تحضير جلسة التدريب المخصصة...
                </h1>
            </div>
        );
    }

    const handleSelectOption = (questionIndex, option) => {
        setAnswers(prev => ({...prev, [questionIndex]: option}));
    };

    const handleSubmit = () => {
        setSubmitted(true);
        // يمكنك هنا حساب النتيجة إذا أردت، أو فقط إرسال الإجابات
        handleWeakPointsQuizComplete(answers);
    };

    const getButtonClass = (question, option) => {
        if (!submitted) {
            return answers[currentQuestionIndex] === option 
                ? 'bg-sky-500/30 border-sky-400' 
                : 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-700';
        }
        // بعد الإجابة
        if (option === question.correctAnswer) return 'bg-green-500/50 border-green-400';
        if (option === answers[currentQuestionIndex]) return 'bg-red-500/50 border-red-400';
        return 'bg-slate-800/50 opacity-60';
    };
    
    const currentQuestion = weakPointsQuiz[currentQuestionIndex];

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
             <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
                📝 جلسة تدريب نقاط الضعف
            </h2>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
                <p className="text-center text-slate-500 dark:text-slate-400 mb-4">
                    السؤال {currentQuestionIndex + 1} من {weakPointsQuiz.length}
                </p>
                <h3 dir="ltr" className="text-xl text-slate-800 dark:text-slate-100 mb-6 min-h-[56px] text-left">
                    {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, i) => (
                        <button 
                            key={i} 
                            dir="ltr" 
                            onClick={() => !submitted && handleSelectOption(currentQuestionIndex, option)} 
                            disabled={submitted} 
                            className={`w-full text-left p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white transition-all duration-300 ${getButtonClass(currentQuestion, option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    {currentQuestionIndex < weakPointsQuiz.length - 1 ? (
                        <button 
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            disabled={!answers[currentQuestionIndex]}
                            className="w-full bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-all disabled:opacity-50"
                        >
                            السؤال التالي
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={!answers[currentQuestionIndex] || submitted}
                            className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50"
                        >
                            إنهاء الجلسة
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeakPointsQuiz;

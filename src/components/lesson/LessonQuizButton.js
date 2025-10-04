// src/components/lesson/LessonQuizButton.js
import React from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';

const LessonQuizButton = ({ onStartQuiz, isLoading }) => {
    return (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                🧠 اختبر معلوماتك
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
                هل أنت مستعد لاختبار فهمك لهذا الدرس؟
            </p>
            <button 
                onClick={onStartQuiz} 
                disabled={isLoading} 
                className="w-full bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400"
            >
                {isLoading ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    <>
                        <Sparkles size={18} /> ابدأ الاختبار
                    </>
                )}
            </button>
        </div>
    );
};

export default LessonQuizButton;

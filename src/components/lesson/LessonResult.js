// src/components/lesson/LessonResult.js
import React from 'react';
import { LoaderCircle } from 'lucide-react';

const LessonResult = ({ quizResult, onComplete, isCompleting }) => {
    return (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-400 mb-2">
                اكتمل الدرس!
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300">
                نتيجتك في الاختبار:
            </p>
            <p className="text-6xl font-bold my-4 text-sky-500 dark:text-sky-400">
                {quizResult.score} / {quizResult.total}
            </p>
            <p className="text-green-600 dark:text-green-400 font-semibold">
                🎉 رائع! لقد أتقنت هذا الدرس.
            </p>
            <button
                onClick={onComplete}
                disabled={isCompleting}
                className="mt-6 w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2"
            >
                {isCompleting ? (
                    <LoaderCircle className="animate-spin" />
                ) : (
                    'إكمال الدرس والعودة'
                )}
            </button>
        </div>
    );
};

export default LessonResult;

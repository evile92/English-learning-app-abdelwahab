// src/components/lesson/ReviewPrompt.js
import React from 'react';
import { RefreshCw } from 'lucide-react';

const ReviewPrompt = ({ quizResult, onRetry }) => {
    return (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg text-center animate-fade-in">
            <h3 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                تحتاج إلى مراجعة!
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300">
                نتيجتك كانت <span className="font-bold">{quizResult.score} / {quizResult.total}</span>.
            </p>
            <p className="text-amber-600 dark:text-amber-400 font-semibold mt-2 mb-6">
                لا بأس، التعلم يحتاج إلى تكرار. نوصي بمراجعة الدرس مرة أخرى لترسيخ المعلومات قبل المحاولة مجدداً.
            </p>
            <button
                onClick={onRetry}
                className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
                <RefreshCw size={18} /> العودة للدرس والمحاولة مرة أخرى
            </button>
        </div>
    );
};

export default ReviewPrompt;

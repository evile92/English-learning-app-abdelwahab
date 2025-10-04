// src/components/lesson/LessonLoading.js
import React from 'react';
import { LoaderCircle } from 'lucide-react';

const LessonLoading = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-10 rounded-2xl shadow-lg">
            <LoaderCircle className="animate-spin text-sky-500 dark:text-sky-400" size={48} />
            <p className="mt-4 text-lg font-semibold text-slate-600 dark:text-slate-300">
                نقوم بإعداد الدرس لك...
            </p>
        </div>
    );
};

export default LessonLoading;

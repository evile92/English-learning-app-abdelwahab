// src/components/lesson/LessonExplanation.js
import React from 'react';

const LessonExplanation = ({ lessonContent }) => {
    if (!lessonContent) return null;

    return (
        <div className="animate-fade-in relative">
            {/* قسم الشرح */}
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <h2 dir="ltr" className="text-left text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    [translate:Explanation]
                </h2>
                <p dir="ltr" className="text-left text-lg leading-relaxed text-slate-700 dark:text-slate-300" 
                   style={{ whiteSpace: 'pre-wrap' }}>
                    {lessonContent.explanation.en}
                </p>
                <div dir="rtl" className="mt-4 p-4 bg-slate-100 dark:bg-slate-900/50 rounded-lg border-r-4 border-sky-500">
                    <p className="text-right text-lg leading-relaxed text-slate-700 dark:text-slate-200" 
                       style={{ whiteSpace: 'pre-wrap' }}>
                        {lessonContent.explanation.ar}
                    </p>
                </div>
            </div>

            {/* قسم الأمثلة */}
            <div className="mt-6 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4 text-left">
                    [translate:Examples]
                </h3>
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
                                    <p dir="ltr" className="text-left text-lg text-slate-800 dark:text-slate-200 m-0" 
                                       style={{ whiteSpace: 'pre-wrap' }}>
                                        {englishPart}
                                    </p>
                                    {arabicPart && (
                                        <p dir="rtl" className="text-left text-sm text-slate-500 dark:text-slate-400 m-0 pt-1" 
                                           style={{ whiteSpace: 'pre-wrap' }}>
                                            {arabicPart}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LessonExplanation;

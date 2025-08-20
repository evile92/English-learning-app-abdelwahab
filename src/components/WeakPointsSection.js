// src/components/WeakPointsSection.js

import React from 'react';
import { Target, LoaderCircle, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const WeakPointsSection = () => {
    const { 
        weakPoints, 
        isAnalyzing, 
        startWeakPointsTraining,
        lastTrainingDate,
        canTrainAgain
    } = useAppContext();

    if (isAnalyzing) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <LoaderCircle className="animate-spin text-sky-500" size={64} />
                <h1 className="text-2xl font-bold mt-6 text-slate-800 dark:text-white">
                    نقوم بتحليل أدائك...
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                    نبحث عن الأنماط في أخطائك لتحديد نقاط ضعفك.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-3">
                <Target /> تدريب نقاط الضعف
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
                يقوم النظام تلقائيًا بتحديد المواضيع التي تحتاج فيها إلى مزيد من التدريب.
            </p>

            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg">
                {weakPoints && weakPoints.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            تم تحديد نقاط الضعف التالية:
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            ركز على هذه المواضيع لتقوية أساسك في اللغة الإنجليزية.
                        </p>
                        <ul className="list-disc list-inside mb-6 text-slate-700 dark:text-slate-200 space-y-2">
                            {weakPoints.map(point => (
                                <li key={point.topicId}>
                                    <span className="font-semibold">{point.title}</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400"> (تكرر الخطأ {point.errorCount} مرات)</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={startWeakPointsTraining}
                            disabled={!canTrainAgain}
                            className="w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                           <BrainCircuit size={20} /> 
                           {canTrainAgain ? 'ابدأ جلسة تدريب مخصصة' : `يمكنك التدريب مرة أخرى غدًا`}
                        </button>
                         {!canTrainAgain && (
                             <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
                                 آخر تدريب كان بتاريخ: {new Date(lastTrainingDate).toLocaleDateString()}
                             </p>
                         )}
                    </div>
                ) : (
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                            لا توجد نقاط ضعف واضحة حاليًا!
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                            أداؤك جيد جدًا. استمر في إكمال الدروس، وسيقوم النظام بإعلامك إذا ظهرت أي أنماط تحتاج إلى مراجعة.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeakPointsSection;

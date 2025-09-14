// src/components/SmartFocusSection.js
import React from 'react';
import { Target, LoaderCircle, BrainCircuit, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const SmartFocusSection = () => {
    const { 
        smartFocusTopics, 
        isAnalyzing, 
        startTopicTraining,
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
                    نبحث عن المواضيع التي تحتاج إلى تركيز إضافي.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="text-center mb-8">
                <Target className="mx-auto text-sky-500 mb-4" size={48} />
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">التركيز الذكي</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                    لقد حددنا لك بعض المواضيع التي تحتاج إلى تدريب إضافي لتقوية مهاراتك.
                </p>
            </div>

            {smartFocusTopics && smartFocusTopics.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {smartFocusTopics.map(topic => (
                        <div key={topic.topicId} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                    {topic.title}
                                </h3>
                                <div className="flex justify-between items-center my-3">
                                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">مستوى الإتقان</span>
                                    <span className={`font-bold ${topic.mastery < 50 ? 'text-red-500' : 'text-green-500'}`}>{topic.mastery}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full ${topic.mastery < 50 ? 'bg-red-500' : 'bg-green-500'}`} 
                                        style={{ width: `${topic.mastery}%` }}
                                    ></div>
                                </div>
                            </div>
                            <button 
                                onClick={() => startTopicTraining(topic)}
                                disabled={!canTrainAgain}
                                className="mt-6 w-full bg-sky-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                               <Zap size={18} /> 
                               ابدأ جلسة تدريب
                            </button>
                        </div>
                    ))}
                     {!canTrainAgain && (
                         <p className="md:col-span-2 text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
                             لقد تدربت اليوم. يمكنك التدريب مرة أخرى غدًا. آخر تدريب كان بتاريخ: {new Date(lastTrainingDate).toLocaleDateString('ar-EG', { numberingSystem: 'latn' })}
                         </p>
                     )}
                </div>
            ) : (
                <div className="text-center bg-white dark:bg-slate-800/50 p-8 rounded-2xl max-w-lg mx-auto">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        لا توجد توصيات حاليًا!
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                        أداؤك رائع. استمر في إكمال الدروس، وسيقوم النظام بتحديد أي مواضيع تحتاج إلى تركيز لاحقًا.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SmartFocusSection;

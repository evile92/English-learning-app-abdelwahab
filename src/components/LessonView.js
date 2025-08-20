// src/components/LessonView.js

import React, { useEffect, useMemo } from 'react';
import { ArrowLeft, CheckCircle, Star, Award } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const LessonView = () => {
    const { 
        selectedLevelId, handleBackToDashboard, handleSelectLesson, 
        lessonsDataState, initialLevels, startFinalExam 
    } = useAppContext();

    const level = initialLevels[selectedLevelId];
    const lessons = lessonsDataState[selectedLevelId] || [];

    useEffect(() => {
        if (!level) {
            handleBackToDashboard();
        }
    }, [level, handleBackToDashboard]);

    const isLevelComplete = useMemo(() => 
        lessons.length > 0 && lessons.every(l => l.completed),
    [lessons]);

    if (!level) {
        return null;
    }

    const completedCount = lessons.filter(l => l.completed).length;
    const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

    const truncateTitle = (title) => {
        if (title.length > 35) {
            return title.substring(0, 35) + '...';
        }
        return title;
    };

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <button onClick={handleBackToDashboard} className="flex items-center gap-2 text-sky-500 dark:text-sky-400 hover:underline mb-6 font-semibold"><ArrowLeft size={20} /> العودة إلى المجرات</button>
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${level.color} flex items-center justify-center text-white text-4xl font-bold`}>{level.icon}</div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{level.name}</h1>
                    <p className="text-slate-600 dark:text-slate-300">المستوى: {selectedLevelId}</p>
                </div>
            </div>
            <div className="mb-8">
                <p className="text-slate-700 dark:text-slate-200 mb-2">التقدم: {Math.round(progress)}%</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4"><div className={`bg-gradient-to-r ${level.color} h-4 rounded-full`} style={{ width: `${progress}%` }}></div></div>
            </div>

            {isLevelComplete && (
                <div className="my-8 p-6 bg-amber-100 dark:bg-amber-900/50 border-2 border-dashed border-amber-400 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">
                        🎉 تهانينا! لقد أكملت كل الدروس!
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 mb-4">
                        أنت الآن جاهز للامتحان النهائي لفتح شهادتك والمستوى التالي.
                    </p>
                    <button 
                        onClick={() => startFinalExam(selectedLevelId)}
                        className="bg-amber-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <Award size={20} />
                        ابدأ الامتحان النهائي
                    </button>
                </div>
            )}

            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">قائمة الدروس</h2>
            <div className="space-y-3">
                {lessons.map(lesson => (
                    <div key={lesson.id} className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-lg flex items-center justify-between transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${lesson.completed ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>{lesson.completed ? <CheckCircle size={20}/> : lesson.id.split('-')[1]}</div>
                            <div className="flex-1 min-w-0">
                                <span className={`font-medium block truncate ${lesson.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-800 dark:text-slate-200'}`} title={lesson.title}>
                                    {truncateTitle(lesson.title)}
                                </span>
                                {lesson.completed && (<div className="flex">{[...Array(3)].map((_, i) => <Star key={i} size={14} className={i < lesson.stars ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'} fill="currentColor"/>)}</div>)}
                            </div>
                        </div>
                        <button onClick={() => handleSelectLesson(lesson)} className="text-sm flex-shrink-0 font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300">ابدأ</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LessonView;

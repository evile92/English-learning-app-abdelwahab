// src/components/Dashboard.js

import React from 'react';
import { Flame } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { userLevel, handleLevelSelect, lessonsDataState, streakData, initialLevels } = useAppContext();

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">مسارات التعلم (الكواكب والمجرات)</h1>
                    <p className="text-slate-600 dark:text-slate-300">رحلتك الكونية تبدأ هنا. كل كوكب يمثل مستوى جديداً من الإتقان.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ProgressIndicator lessonsData={lessonsDataState} />
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg">
                        <Flame className="text-orange-500" size={24} />
                        <span className="font-bold text-xl text-slate-700 dark:text-white">{streakData.count}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">أيام متتالية</span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(initialLevels).map(([key, level]) => {
                    const isLocked = Object.keys(initialLevels).indexOf(key) > Object.keys(initialLevels).indexOf(userLevel);
                    const levelLessons = lessonsDataState[key] || [];
                    const completedCount = levelLessons.filter(l => l.completed).length;
                    const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
                    return (
                        <div key={key} onClick={() => !isLocked && handleLevelSelect(key)} className={`p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${isLocked ? 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed' : `bg-gradient-to-br ${level.color} text-white cursor-pointer shadow-xl shadow-blue-500/20`}`}>
                            <div className="flex justify-between items-start">
                                <div className="text-5xl font-bold opacity-80">{level.icon}</div>
                                {isLocked && <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded-full">🔒 مغلق</span>}
                            </div>
                            <h3 className={`text-2xl font-bold mt-4 ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}>{level.name}</h3>
                            <p className={`${isLocked ? 'text-slate-500 dark:text-slate-400' : 'opacity-80'} mt-1`}>{level.lessons} درسًا</p>
                            {!isLocked && (
                                <div className="mt-4">
                                    <div className="w-full bg-white/20 rounded-full h-2.5"><div className="bg-white h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                                    <p className="text-sm mt-1 opacity-90">{Math.round(progress)}% مكتمل</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;

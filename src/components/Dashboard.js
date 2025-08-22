// src/components/Dashboard.js

import React from 'react';
import { Flame, Target, CheckCircle } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import FloatingMissionButton from './FloatingMissionButton';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { 
        user, userLevel, handleLevelSelect, lessonsDataState, streakData, initialLevels,
        dailyGoal, setDailyGoal, timeSpent 
    } = useAppContext();

    const goalProgress = Math.min((timeSpent.time / (dailyGoal * 60)) * 100, 100);

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            
            {userLevel && <FloatingMissionButton />}

            <div className="mb-10 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-3 rounded-full shadow-lg flex items-center gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Target className="text-sky-500" size={20} />
                    <h3 className="font-semibold text-slate-700 dark:text-white text-sm whitespace-nowrap">هدفك اليومي</h3>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 relative">
                    <div 
                        className="bg-gradient-to-r from-sky-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${goalProgress}%` }}
                    ></div>
                     {goalProgress === 100 && (
                        <CheckCircle size={16} className="text-white bg-green-500 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                     )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {Math.floor(timeSpent.time / 60)}/{dailyGoal} د
                    </p>
                    <div className="w-px h-4 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="flex items-center gap-1">
                        {[10, 15, 30].map(minutes => (
                            <button 
                                key={minutes}
                                onClick={() => setDailyGoal(minutes)}
                                className={`w-6 h-6 text-xs font-semibold rounded-full transition-colors flex items-center justify-center ${
                                    dailyGoal === minutes 
                                    ? 'bg-sky-500 text-white' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                {minutes}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">مسارات التعلم (الكواكب والمجرات)</h1>
                    <p className="text-slate-600 dark:text-slate-300">رحلتك الكونية تبدأ هنا. كل كوكب يمثل مستوى جديداً من الإتقان.</p>
                </div>
                {user && (
                    <div className="flex items-center gap-4">
                        <ProgressIndicator lessonsData={lessonsDataState} />
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg">
                            <Flame className="text-orange-500" size={24} />
                            <span className="font-bold text-xl text-slate-700 dark:text-white">{streakData.count}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">أيام متتالية</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(initialLevels).map(([key, level]) => {
                    const isLocked = !userLevel || (Object.keys(initialLevels).indexOf(key) > Object.keys(initialLevels).indexOf(userLevel));
                    const levelLessons = lessonsDataState?.[key] || [];
                    const completedCount = levelLessons.filter(l => l.completed).length;
                    const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
                    
                    const isActiveLevel = key === userLevel;
                    const activeGlowClass = isActiveLevel 
                        ? 'shadow-xl shadow-sky-400/50 dark:shadow-sky-300/40'
                        : 'shadow-xl shadow-blue-500/20';

                    return (
                        <div 
                            key={key} 
                            onClick={() => !isLocked && handleLevelSelect(key)} 
                            className={`
                                p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group isolate
                                ${isLocked 
                                    ? 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                    : `bg-gradient-to-br ${level.color} text-white cursor-pointer ${activeGlowClass}`
                                }
                                ${isActiveLevel ? 'ring-4 ring-offset-4 ring-sky-300 dark:ring-sky-400 ring-offset-transparent dark:ring-offset-slate-900' : ''}
                            `}
                        >
                            <div className="absolute inset-0 bg-repeat bg-center opacity-10 transition-opacity duration-500 group-hover:opacity-20"
                                 style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}>
                            </div>
                            
                            {!isLocked && (
                                <div 
                                    data-level={key}
                                    className="
                                        absolute inset-0 -z-10 animate-float 
                                        before:content-[''] before:absolute before:rounded-full after:content-[''] after:absolute after:rounded-full
                                        data-[level=A1]:before:bg-sky-200/40 data-[level=A1]:before:w-24 data-[level=A1]:before:h-24 data-[level=A1]:before:-top-4 data-[level=A1]:before:-right-8
                                        data-[level=A2]:before:bg-teal-200/40 data-[level=A2]:before:w-16 data-[level=A2]:before:h-16 data-[level=A2]:before:top-6 data-[level=A2]:before:-right-4 data-[level=A2]:after:bg-teal-200/20 data-[level=A2]:after:w-8 data-[level=A2]:after:h-8 data-[level=A2]:after:bottom-4 data-[level=A2]:after:right-12
                                        data-[level=B1]:before:border-amber-200/50 data-[level=B1]:before:border-8 data-[level=B1]:before:w-32 data-[level=B1]:before:h-32 data-[level=B1]:before:top-4 data-[level=B1]:before:-right-12 data-[level=B1]:before:rotate-45
                                        data-[level=B2]:before:bg-orange-200/50 data-[level=B2]:before:w-20 data-[level=B2]:before:h-20 data-[level=B2]:before:top-1/2 data-[level=B2]:before:-translate-y-1/2 data-[level=B2]:before:-right-10
                                        data-[level=C1]:before:border-purple-200/50 data-[level=C1]:before:border-4 data-[level=C1]:before:w-24 data-[level=C1]:before:h-24 data-[level=C1]:before:top-2 data-[level=C1]:before:-right-6 data-[level=C1]:after:border-purple-200/30 data-[level=C1]:after:border-2 data-[level=C1]:after:w-12 data-[level=C1]:after:h-12 data-[level=C1]:after:bottom-2 data-[level=C1]:after:right-10 data-[level=C1]:after:rotate-12
                                    "
                                ></div>
                            )}

                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div className="text-5xl font-bold opacity-80">{level.icon}</div>
                                    {isLocked && <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded-full">🔒 مغلق</span>}
                                </div>
                                <h3 className={`text-2xl font-bold mt-4 ${isLocked ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`}>{level.name}</h3>
                                <p className={`${isLocked ? 'text-slate-500 dark:text-slate-400' : 'opacity-80'} mt-1`}>{level.lessons} درسًا</p>
                                {!isLocked && (
                                    <div className="mt-4">
                                        <div className="w-full bg-white/20 rounded-full h-2.5">
                                            <div className="bg-white h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-sm mt-1 opacity-90">{Math.round(progress)}% مكتمل</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <style jsx global>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(5deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>

        </div>
    );
};

export default Dashboard;

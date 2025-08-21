// src/components/Dashboard.js

import React from 'react';
import { Flame } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import FloatingMissionButton from './FloatingMissionButton';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { user, userLevel, handleLevelSelect, lessonsDataState, streakData, initialLevels } = useAppContext();

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            
            {userLevel && <FloatingMissionButton />}

            <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
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
                    
                    // --- (بداية التعديلات الجمالية) ---
                    const isActiveLevel = key === userLevel;
                    const activeGlowClass = isActiveLevel 
                        ? 'shadow-lg shadow-sky-400/50 dark:shadow-sky-300/40 animate-pulse' 
                        : 'shadow-lg shadow-blue-500/20';
                    // --- (نهاية التعديلات الجمالية) ---

                    return (
                        <div 
                            key={key} 
                            onClick={() => !isLocked && handleLevelSelect(key)} 
                            // --- (بداية التعديلات الجمالية) ---
                            className={`p-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group
                                ${isLocked 
                                    ? 'bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 cursor-not-allowed' 
                                    : `bg-gradient-to-br ${level.color} text-white cursor-pointer ${activeGlowClass}`
                                }`
                            }
                            // --- (نهاية التعديلات الجمالية) ---
                        >
                            {/* --- (إضافة خلفية النجوم عند التمرير) --- */}
                            {!isLocked && (
                                <div className="absolute inset-0 bg-repeat bg-center opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                                     style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}>
                                </div>
                            )}
                            {/* --- (نهاية الإضافة) --- */}

                            <div className="relative z-10"> {/* للتأكد من أن المحتوى فوق النجوم */}
                                <div className="flex justify-between items-start">
                                    <div className="text-5xl font-bold opacity-80">{level.icon}</div>
                                    {isLocked && <span className="text-xs bg-slate-500 text-white px-2 py-1 rounded-full">🔒 مغلق</span>}
                                 ઉ.

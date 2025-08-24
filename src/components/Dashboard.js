// src/components/Dashboard.js

import React, { useMemo } from 'react';
import { Flame, Target, CheckCircle, Rocket, Award, BrainCircuit, ChevronRight } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
    const { 
        user, userLevel, handleLevelSelect, lessonsDataState, streakData, initialLevels,
        dailyGoal, setDailyGoal, timeSpent,
        startFinalExam, handleSelectLesson, handlePageChange,
        examPromptForLevel, reviewItems, weakPoints, canTrainAgain
    } = useAppContext();

    const goalProgress = Math.min((timeSpent.time / (dailyGoal * 60)) * 100, 100);
    const isGoalComplete = goalProgress >= 100;

    const mission = useMemo(() => {
        if (!userLevel) return null;

        const currentLevelLessons = lessonsDataState[userLevel] || [];
        const nextLesson = currentLevelLessons.find(lesson => !lesson.completed);

        if (weakPoints && weakPoints.length > 0 && canTrainAgain) {
            return { type: 'weakPoints', title: 'مهمة ذات أولوية', description: `تدريب نقاط الضعف (${weakPoints.length})`, buttonText: 'ابدأ الآن', icon: Target, color: 'from-red-500 to-orange-500', action: () => handlePageChange('weakPoints') };
        } 
        else if (examPromptForLevel && examPromptForLevel === userLevel) {
            return { type: 'exam', title: 'الامتحان النهائي', description: `مستوى ${userLevel}`, buttonText: 'ابدأ الامتحان', icon: Award, color: 'from-amber-500 to-yellow-500', action: () => startFinalExam(userLevel) };
        } 
        else if (reviewItems && reviewItems.length > 0) {
            return { type: 'review', title: 'المراجعة الذكية', description: `(${reviewItems.length}) عناصر جاهزة للمراجعة`, buttonText: 'ابدأ المراجعة', icon: BrainCircuit, color: 'from-sky-400 to-blue-500', action: () => handlePageChange('review') };
        } 
        else if (nextLesson) {
            return { type: 'lesson', title: 'مهمتك التالية', description: nextLesson.title, buttonText: 'ابدأ الدرس', icon: Rocket, color: 'from-sky-400 to-blue-500', action: () => handleSelectLesson(nextLesson) };
        } 
        else {
            return { type: 'explore', title: 'عمل رائع!', description: 'استكشف أدوات تعلم أخرى', buttonText: 'استكشف', icon: Rocket, color: 'from-emerald-400 to-green-500', action: () => handlePageChange('writing') };
        }
    }, [userLevel, lessonsDataState, examPromptForLevel, reviewItems, weakPoints, canTrainAgain, handleSelectLesson, startFinalExam, handlePageChange]);

    return (
        <div className="p-4 md:p-8 animate-fade-in z-10 relative">
            
            {/* ✅  تم تطبيق التأثير الزجاجي الشفاف هنا */}
            <div className="mb-12 bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-slate-300 dark:border-slate-700 p-4 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* قسم المهمة التالية */}
                {mission ? (
                    <div onClick={mission.action} className="flex-1 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between cursor-pointer group hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${mission.color} flex-shrink-0 flex items-center justify-center text-white shadow-md`}>
                                <mission.icon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">{mission.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm truncate max-w-[150px] sm:max-w-xs">{mission.description}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-slate-400 group-hover:text-sky-500 transition-colors flex-shrink-0" />
                    </div>
                ) : ( 
                    // رسالة للزائر
                    <div className="flex-1 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                         <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex-shrink-0 flex items-center justify-center text-white shadow-md`}>
                            <Rocket size={20} />
                        </div>
                        <div>
                             <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">أهلاً بك في Stellar Speak!</h3>
                             <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">ابدأ بتحديد مستواك لتبدأ رحلتك.</p>
                        </div>
                    </div>
                )}

                {/* قسم الهدف اليومي */}
                <div className="flex-1 p-4 rounded-lg bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-4">
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-slate-800 dark:text-white text-sm">هدفك اليومي</h3>
                            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                                {Math.floor(timeSpent.time / 60)}/{dailyGoal} د
                            </p>
                        </div>
                        <div className="w-full bg-slate-200/70 dark:bg-slate-700/70 rounded-full h-2 relative">
                            <div 
                                className={`bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-500 ${isGoalComplete ? 'animate-goal-complete' : ''}`} 
                                style={{ width: `${goalProgress}%` }}
                            ></div>
                            {isGoalComplete && (
                                <CheckCircle size={14} className="text-white bg-green-500 rounded-full absolute top-1/2 right-0 -translate-y-1/2" style={{ transform: `translateX(${-100 + goalProgress}%) translateY(-50%)`}}/>
                            )}
                        </div>
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
                                    ? 'bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-slate-300 dark:border-slate-700 cursor-not-allowed' 
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
                
                @keyframes goal-complete-animation {
                    0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7); }
                    70% { box-shadow: 0 0 10px 15px rgba(22, 163, 74, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
                }
                .animate-goal-complete {
                    animation: goal-complete-animation 2s infinite;
                    background-image: linear-gradient(to right, #10B981, #34D399);
                }
            `}</style>

        </div>
    );
};

export default Dashboard;

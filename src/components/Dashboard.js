// src/components/Dashboard.js

import React, { useMemo } from 'react';
import { Flame, Target, CheckCircle, Rocket, Award, BrainCircuit, ChevronRight } from 'lucide-react';
import ProgressIndicator from './ProgressIndicator';
import { useAppContext } from '../context/AppContext';
import CosmicMap from './CosmicMap';

const Dashboard = () => {
    const { 
        user, userLevel, lessonsDataState, streakData,
        dailyGoal, timeSpent,
        startFinalExam, handleSelectLesson, handlePageChange,
        examPromptForLevel, reviewItems, weakPoints, canTrainAgain,
        userName
    } = useAppContext();

    const goalProgress = Math.min((timeSpent.time / (dailyGoal * 60)) * 100, 100);
    const isGoalComplete = goalProgress >= 100;

    const getGreeting = () => {
        const currentHour = new Date().getHours();
        const displayName = userName || user?.displayName || 'رحالتنا الكوني';

        if (currentHour < 12) {
            return `☀️ صباح الخير، ${displayName}!`;
        } else if (currentHour < 18) {
            return `👋 يومك سعيد، ${displayName}!`;
        } else {
            return `🌙 مساء الخير، ${displayName}!`;
        }
    };

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
            
            {/* --- ✅ بداية التعديل: واجهة ترحيبية أبسط وأكثر أناقة --- */}
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">{getGreeting()}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">اختر كوكبك، وابدأ رحلتك اليوم.</p>

                {/* شريط المعلومات المدمج */}
                {user && (
                    <div className="mt-6 flex justify-center items-center gap-2 md:gap-4 flex-wrap">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-sm">
                            <Flame className="text-orange-500" size={20} />
                            <span className="font-bold text-md text-slate-700 dark:text-white">{streakData.count}</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">أيام متتالية</span>
                        </div>
                        <ProgressIndicator lessonsData={lessonsDataState} />
                    </div>
                )}
            </div>
            {/* --- نهاية التعديل --- */}

            <CosmicMap />

            <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">ملخص مهامك اليومية</h2>
                <div className="bg-white/30 dark:bg-slate-800/30 backdrop-blur-md border border-slate-300 dark:border-slate-700 p-4 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                    
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
            </div>

        </div>
    );
};

export default Dashboard;

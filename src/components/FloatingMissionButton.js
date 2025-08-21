// src/components/FloatingMissionButton.js

import React, { useState, useEffect } from 'react';
import { Rocket, X, Award, BookCopy, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const FloatingMissionButton = () => {
    const {
        userLevel,
        lessonsDataState,
        handleSelectLesson,
        startFinalExam,
        handlePageChange,
        examPromptForLevel,
        reviewItems,
    } = useAppContext();

    // الخطوة 1: تعريف كل الـ Hooks في الأعلى
    const [isOpen, setIsOpen] = useState(false);
    const [mission, setMission] = useState(null);

    // الخطوة 2: كل الـ useEffects تأتي بعد تعريف الحالات مباشرة
    useEffect(() => {
        const currentLevelLessons = lessonsDataState && userLevel ? lessonsDataState[userLevel] || [] : [];
        const nextLesson = currentLevelLessons.find(lesson => !lesson.completed);
        let currentMission = null;

        if (examPromptForLevel === userLevel) {
            currentMission = { type: 'exam', title: 'الامتحان النهائي', description: `أثبت إتقانك لمستوى ${userLevel}`, buttonText: 'ابدأ الامتحان', action: () => startFinalExam(userLevel) };
        } else if (nextLesson) {
            currentMission = { type: 'lesson', title: 'مهمتك التالية', description: nextLesson.title, buttonText: 'ابدأ الدرس', action: () => handleSelectLesson(nextLesson) };
        } else if (reviewItems && reviewItems.length > 0) {
            currentMission = { type: 'review', title: 'المراجعة الذكية', description: `لديك ${reviewItems.length} عناصر للمراجعة`, buttonText: 'ابدأ المراجعة', action: () => handlePageChange('review') };
        } else if (userLevel) {
            currentMission = { type: 'explore', title: 'عمل رائع!', description: 'لقد أكملت كل مهامك. استكشف أدوات التعلم الأخرى.', buttonText: 'استكشف', action: () => handlePageChange('writing') };
        }
        
        setMission(currentMission);
    }, [userLevel, lessonsDataState, examPromptForLevel, reviewItems, handleSelectLesson, startFinalExam, handlePageChange]);

    useEffect(() => {
        const closeMenu = () => setIsOpen(false);
        if (isOpen) {
            window.addEventListener('click', closeMenu);
        }
        return () => {
            window.removeEventListener('click', closeMenu);
        };
    }, [isOpen]);
    
    // الخطوة 3: الآن فقط يمكننا إيقاف المكون إذا لم تكن هناك مهمة
    if (!mission) {
        return null;
    }

    const toggleOpen = (e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const navigate = () => {
        mission.action();
        setIsOpen(false);
    };

    const Icon = mission.icon || Rocket;

    return (
        <div className="fixed top-[72px] left-4 z-50 animate-fade-in">
            <div 
                onClick={toggleOpen}
                className="relative w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer animate-pulse"
                title="مهمتك التالية"
            >
                <Icon size={28} />
            </div>

            {isOpen && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-16 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 w-72 animate-fade-in-fast"
                >
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-sky-500 dark:text-sky-400">{mission.title}</p>
                        <button onClick={toggleOpen} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                           <X size={16} className="text-slate-500"/>
                        </button>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mb-4">{mission.description}</p>
                    <button
                        onClick={navigate}
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                    >
                        {mission.buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingMissionButton;

// src/components/CurrentMission.js

import React from 'react';
import { Rocket, Award, BookCopy, Zap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CurrentMission = () => {
    const { 
        userLevel, 
        lessonsDataState, 
        handleSelectLesson, 
        startFinalExam,
        handlePageChange,
        examPromptForLevel
    } = useAppContext();

    // --- منطق تحديد المهمة التالية ---
    let mission = null;
    const currentLevelLessons = lessonsDataState[userLevel] || [];
    const nextLesson = currentLevelLessons.find(lesson => !lesson.completed);

    if (examPromptForLevel === userLevel) {
        mission = {
            type: 'exam',
            title: `الامتحان النهائي لمستوى ${userLevel}`,
            description: 'لقد أكملت كل الدروس! أثبت إتقانك للمستوى لفتح شهادتك.',
            buttonText: 'ابدأ الامتحان النهائي',
            icon: Award,
            action: () => startFinalExam(userLevel)
        };
    } else if (nextLesson) {
        mission = {
            type: 'lesson',
            title: `الدرس التالي: ${nextLesson.title}`,
            description: `استمر في رحلتك عبر "كوكب ${userLevel}" لإتقان الأساسيات.`,
            buttonText: 'ابدأ الدرس',
            icon: BookCopy,
            action: () => handleSelectLesson(nextLesson)
        };
    } else {
        mission = {
            type: 'explore',
            title: 'استكشف أدوات التعلم',
            description: 'لقد أكملت كل الدروس المتاحة. عزز مهاراتك باستخدام أدوات الكتابة والمحادثة.',
            buttonText: 'اذهب إلى الأدوات',
            icon: Zap,
            action: () => handlePageChange('writing') // ينقله إلى قسم الكتابة كمثال
        };
    }
    // --- نهاية منطق تحديد المهمة ---

    if (!mission) return null;

    const Icon = mission.icon;

    return (
        <div className="mb-8 p-6 rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg animate-fade-in">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-lg">
                    <Icon size={40} />
                </div>
                <div className="flex-1 text-center md:text-right">
                    <p className="text-sm font-semibold text-sky-500 dark:text-sky-400">مهمتك التالية</p>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{mission.title}</h2>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">{mission.description}</p>
                </div>
                <button 
                    onClick={mission.action}
                    className="w-full md:w-auto bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:from-sky-500 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                    <Rocket size={20} />
                    <span>{mission.buttonText}</span>
                </button>
            </div>
        </div>
    );
};

export default CurrentMission;

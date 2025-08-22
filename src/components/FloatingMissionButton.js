// src/components/FloatingMissionButton.js

import React, { useState, useEffect } from 'react';
// --- (بداية التعديل): استيراد أيقونات جديدة ---
import { Rocket, X, Award, BrainCircuit, Target } from 'lucide-react';
// --- (نهاية التعديل) ---
import { useAppContext } from '../context/AppContext';

const FloatingMissionButton = () => {
    // --- (بداية التعديل): استدعاء بيانات نقاط الضعف ---
    const {
        userLevel,
        lessonsDataState,
        handleSelectLesson,
        startFinalExam,
        handlePageChange,
        examPromptForLevel,
        reviewItems,
        weakPoints, // <-- إضافة جديدة
        canTrainAgain // <-- إضافة جديدة
    } = useAppContext();
    // --- (نهاية التعديل) ---


    const [isOpen, setIsOpen] = useState(false);
    const [mission, setMission] = useState(null);

    // --- (بداية التعديل): إعادة كتابة منطق تحديد المهمة بالكامل ---
    useEffect(() => {
        const currentLevelLessons = lessonsDataState && userLevel ? lessonsDataState[userLevel] || [] : [];
        const nextLesson = currentLevelLessons.find(lesson => !lesson.completed);
        let currentMission = null;

        // الأولوية 1: تدريب نقاط الضعف
        if (weakPoints && weakPoints.length > 0 && canTrainAgain) {
            currentMission = { 
                type: 'weakPoints', 
                title: 'مهمة ذات أولوية', 
                description: `لديك ${weakPoints.length} من نقاط الضعف تحتاج للتدريب.`, 
                buttonText: 'ابدأ تدريب نقاط ضعفي', 
                icon: Target, // أيقونة الهدف
                color: 'from-red-500 to-orange-500', // لون أحمر للأهمية
                action: () => handlePageChange('weakPoints') 
            };
        }
        // الأولوية 2: الامتحان النهائي
        else if (examPromptForLevel === userLevel) {
            currentMission = { 
                type: 'exam', 
                title: 'الامتحان النهائي', 
                description: `أثبت إتقانك لمستوى ${userLevel}`, 
                buttonText: 'ابدأ الامتحان', 
                icon: Award, // أيقونة الشارة
                color: 'from-amber-500 to-yellow-500', // لون ذهبي
                action: () => startFinalExam(userLevel) 
            };
        } 
        // الأولوية 3: المراجعة الذكية
        else if (reviewItems && reviewItems.length > 0) {
            currentMission = { 
                type: 'review', 
                title: 'المراجعة الذكية', 
                description: `لديك ${reviewItems.length} عناصر جاهزة للمراجعة.`, 
                buttonText: 'ابدأ المراجعة', 
                icon: BrainCircuit, // أيقونة الدماغ
                color: 'from-sky-400 to-blue-500', // اللون الافتراضي
                action: () => handlePageChange('review') 
            };
        }
        // الأولوية 4: الدرس التالي
        else if (nextLesson) {
            currentMission = { 
                type: 'lesson', 
                title: 'مهمتك التالية', 
                description: nextLesson.title, 
                buttonText: 'ابدأ الدرس', 
                icon: Rocket, // أيقونة الصاروخ
                color: 'from-sky-400 to-blue-500', // اللون الافتراضي
                action: () => handleSelectLesson(nextLesson) 
            };
        } 
        // في حال عدم وجود أي مهمة
        else if (userLevel) {
            currentMission = { 
                type: 'explore', 
                title: 'عمل رائع!', 
                description: 'لقد أكملت كل مهامك. استكشف أدوات التعلم الأخرى.', 
                buttonText: 'استكشف', 
                icon: Rocket,
                color: 'from-emerald-400 to-green-500', // لون أخضر للإنجاز
                action: () => handlePageChange('writing') 
            };
        }
        
        setMission(currentMission);
    }, [userLevel, lessonsDataState, examPromptForLevel, reviewItems, weakPoints, canTrainAgain, handleSelectLesson, startFinalExam, handlePageChange]);
    // --- (نهاية التعديل) ---


    useEffect(() => {
        const closeMenu = () => setIsOpen(false);
        if (isOpen) {
            window.addEventListener('click', closeMenu);
        }
        return () => {
            window.removeEventListener('click', closeMenu);
        };
    }, [isOpen]);
    
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

    // --- (بداية التعديل): استخدام الأيقونة واللون الديناميكي ---
    const Icon = mission.icon || Rocket;
    const buttonColor = mission.color || 'from-sky-400 to-blue-500';
    // --- (نهاية التعديل) ---


    return (
        <div 
            className="fixed top-[72px] left-4 z-50 animate-fade-in flex flex-col items-center gap-1"
            onClick={toggleOpen}
        >
            <div 
                // --- (بداية التعديل): تطبيق اللون الديناميكي ---
                className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${buttonColor} text-white shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer animate-pulse`}
                // --- (نهاية التعديل) ---
                title="مهمتك التالية"
            >
                <Icon size={28} />
            </div>
            {/* --- (بداية التعديل): تحديث النص ليكون ديناميكيًا --- */}
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-2 py-1 rounded-full">
                {mission.title}
            </p>
            {/* --- (نهاية التعديل) --- */}

            {isOpen && (
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-24 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 w-72 animate-fade-in-fast"
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
                        // --- (بداية التعديل): تطبيق اللون الديناميكي على الزر الداخلي ---
                        className={`w-full bg-gradient-to-r ${buttonColor} hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-opacity duration-300`}
                        // --- (نهاية التعديل) ---
                    >
                        {mission.buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingMissionButton;

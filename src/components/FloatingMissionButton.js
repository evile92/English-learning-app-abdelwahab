// src/components/FloatingMissionButton.js

import React, { useState, useEffect, useRef } from 'react';
import { Rocket, X, Award, BrainCircuit, Target, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { usePersistentState } from '../hooks/usePersistentState'; // استيراد الخطاف

const FloatingMissionButton = () => {
    const {
        userLevel, lessonsDataState, handleSelectLesson,
        startFinalExam, handlePageChange, examPromptForLevel,
        reviewItems, weakPoints, canTrainAgain
    } = useAppContext();

    const [isOpen, setIsOpen] = useState(false);
    const [mission, setMission] = useState(null);
    
    // --- (بداية الإضافة): حالات جديدة للسحب والإخفاء ---
    const [position, setPosition] = usePersistentState('missionButtonPos', { top: 72, left: 16 });
    const [isVisible, setIsVisible] = usePersistentState('missionButtonVisible', true);
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);
    // --- (نهاية الإضافة) ---

    useEffect(() => {
        // ... (منطق تحديد المهمة يبقى كما هو)
        const currentLevelLessons = lessonsDataState && userLevel ? lessonsDataState[userLevel] || [] : [];
        const nextLesson = currentLevelLessons.find(lesson => !lesson.completed);
        let currentMission = null;
        if (weakPoints && weakPoints.length > 0 && canTrainAgain) {
            currentMission = { type: 'weakPoints', title: 'مهمة ذات أولوية', description: `لديك ${weakPoints.length} من نقاط الضعف تحتاج للتدريب.`, buttonText: 'ابدأ تدريب نقاط ضعفي', icon: Target, color: 'from-red-500 to-orange-500', action: () => handlePageChange('weakPoints') };
        } else if (examPromptForLevel === userLevel) {
            currentMission = { type: 'exam', title: 'الامتحان النهائي', description: `أثبت إتقانك لمستوى ${userLevel}`, buttonText: 'ابدأ الامتحان', icon: Award, color: 'from-amber-500 to-yellow-500', action: () => startFinalExam(userLevel) };
        } else if (reviewItems && reviewItems.length > 0) {
            currentMission = { type: 'review', title: 'المراجعة الذكية', description: `لديك ${reviewItems.length} عناصر جاهزة للمراجعة.`, buttonText: 'ابدأ المراجعة', icon: BrainCircuit, color: 'from-sky-400 to-blue-500', action: () => handlePageChange('review') };
        } else if (nextLesson) {
            currentMission = { type: 'lesson', title: 'مهمتك التالية', description: nextLesson.title, buttonText: 'ابدأ الدرس', icon: Rocket, color: 'from-sky-400 to-blue-500', action: () => handleSelectLesson(nextLesson) };
        } else if (userLevel) {
            currentMission = { type: 'explore', title: 'عمل رائع!', description: 'لقد أكملت كل مهامك. استكشف أدوات التعلم الأخرى.', buttonText: 'استكشف', icon: Rocket, color: 'from-emerald-400 to-green-500', action: () => handlePageChange('writing') };
        }
        setMission(currentMission);
    }, [userLevel, lessonsDataState, examPromptForLevel, reviewItems, weakPoints, canTrainAgain, handleSelectLesson, startFinalExam, handlePageChange]);

    // --- (بداية الإضافة): دوال التحكم بالسحب والإفلات ---
    const handleMouseDown = (e) => {
        setIsDragging(true);
        hasDragged.current = false;
        offsetRef.current = {
            x: e.clientX - position.left,
            y: e.clientY - position.top
        };
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        hasDragged.current = true;
        let newTop = e.clientY - offsetRef.current.y;
        let newLeft = e.clientX - offsetRef.current.x;

        // منع الزر من الخروج من الشاشة
        newTop = Math.max(10, Math.min(newTop, window.innerHeight - 80));
        newLeft = Math.max(10, Math.min(newLeft, window.innerWidth - 80));

        setPosition({ top: newTop, left: newLeft });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    // --- (نهاية الإضافة) ---

    if (!mission) return null;

    const toggleOpen = () => {
        if (!hasDragged.current) {
            setIsOpen(!isOpen);
        }
    };

    const navigate = () => {
        mission.action();
        setIsOpen(false);
    };
    
    // --- (بداية الإضافة): إظهار زر الإظهار إذا كان الزر مخفيًا ---
    if (!isVisible) {
        return (
            <div 
                className="fixed z-50 animate-fade-in"
                style={{ top: `${position.top}px`, left: `${position.left}px` }}
            >
                <button
                    onClick={() => setIsVisible(true)}
                    className="w-10 h-10 bg-slate-800/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center shadow-lg"
                    title="إظهار زر المهمة"
                >
                    <Eye size={20} />
                </button>
            </div>
        );
    }
    // --- (نهاية الإضافة) ---

    const Icon = mission.icon || Rocket;
    const buttonColor = mission.color || 'from-sky-400 to-blue-500';

    return (
        // --- (بداية التعديل): تغيير الحاوية لتكون قابلة للتحريك ---
        <div 
            ref={dragRef}
            className="fixed z-50 animate-fade-in"
            style={{ top: `${position.top}px`, left: `${position.left}px`, cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
        >
        {/* --- (نهاية التعديل) --- */}
            <div className="flex flex-col items-center gap-1" onClick={toggleOpen}>
                <div 
                    className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${buttonColor} text-white shadow-lg transition-transform duration-300 flex items-center justify-center`}
                    title="مهمتك التالية"
                >
                    <Icon size={28} />
                    {/* --- (بداية الإضافة): زر الإخفاء الصغير --- */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsVisible(false);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-slate-700/80 text-white rounded-full flex items-center justify-center text-xs hover:bg-slate-900"
                        title="إخفاء الزر"
                    >
                       <EyeOff size={14} />
                    </button>
                    {/* --- (نهاية الإضافة) --- */}
                </div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
                    {mission.title}
                </p>
            </div>
            {isOpen && (
                <div 
                    className="absolute top-24 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-4 w-72 animate-fade-in-fast cursor-default"
                    onMouseDown={(e) => e.stopPropagation()} // منع السحب من القائمة
                >
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-sky-500 dark:text-sky-400">{mission.title}</p>
                        <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                           <X size={16} className="text-slate-500"/>
                        </button>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white mb-4">{mission.description}</p>
                    <button
                        onClick={navigate}
                        className={`w-full bg-gradient-to-r ${buttonColor} hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition-opacity duration-300`}
                    >
                        {mission.buttonText}
                    </button>
                </div>
            )}
        </div>
    );
};

export default FloatingMissionButton;

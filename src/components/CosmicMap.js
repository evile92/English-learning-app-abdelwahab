// src/components/CosmicMap.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock } from 'lucide-react';

const CosmicMap = () => {
    const { 
        initialLevels, 
        userLevel, 
        handleLevelSelect, 
        lessonsDataState 
    } = useAppContext();
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];

    // ==========================================================
    // ============== بداية التعديل: مواقع متجاوبة ==============
    // ==========================================================
    const planetPositions = {
        // تصميم الهاتف (عمودي)
        A1: { base: { top: '10%', left: '25%' } },
        A2: { base: { top: '30%', left: '75%' } },
        B1: { base: { top: '50%', left: '25%' } },
        B2: { base: { top: '70%', left: '75%' } },
        C1: { base: { top: '90%', left: '25%' } },
        // تصميم الكمبيوتر (أفقي)
        md: {
            A1: { top: '80%', left: '15%' },
            A2: { top: '45%', left: '35%' },
            B1: { top: '15%', left: '55%' },
            B2: { top: '45%', left: '75%' },
            C1: { top: '80%', left: '95%' },
        }
    };
    // ==========================================================
    // =================== نهاية التعديل =======================
    // ==========================================================

    return (
        // تم زيادة ارتفاع الحاوية على الهاتف لإعطاء مساحة كافية
        <div className="relative w-full max-w-4xl mx-auto h-[650px] md:h-[500px] my-8">
            {/* المسار الكوني المتجاوب */}
            <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 650" preserveAspectRatio="xMidYMid meet"
                 xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                        <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                    </linearGradient>
                </defs>

                {/* ========================================================== */}
                {/* ======== بداية التعديل: إضافة مسارات متجاوبة ========= */}
                {/* ========================================================== */}
                
                {/* مسار الهاتف (يظهر على الشاشات الصغيرة فقط) */}
                <path 
                    d="M100 65 C 200 125, 200 195, 300 195 C 400 195, 300 260, 300 325 C 300 390, 200 455, 100 455 C 0 455, 100 520, 100 585"
                    stroke="url(#pathGradient)" strokeWidth="3" fill="none" strokeDasharray="10 7"
                    className="md:hidden animate-path-flow"
                />

                {/* مسار الكمبيوتر (يظهر على الشاشات المتوسطة والكبيرة فقط) */}
                <path 
                    d="M150 400 C 300 200, 400 50, 550 75 S 750 250, 950 400" 
                    stroke="url(#pathGradient)" strokeWidth="4" fill="none" strokeDasharray="15 10"
                    className="hidden md:block animate-path-flow-desktop"
                    transform="scale(0.4, 0.98)"
                />
                {/* ========================================================== */}
                {/* =================== نهاية التعديل ======================= */}
                {/* ========================================================== */}
            </svg>

            {/* رسم الكواكب (المستويات) */}
            {levelOrder.map(levelId => {
                const level = initialLevels[levelId];
                const levelLessons = lessonsDataState?.[levelId] || [];
                const completedCount = levelLessons.filter(l => l.completed).length;
                const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
                
                const isLocked = !userLevel || (levelOrder.indexOf(levelId) > levelOrder.indexOf(userLevel));
                const isActiveLevel = levelId === userLevel;

                return (
                    <div
                        key={levelId}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                        style={{ 
                            top: planetPositions[levelId].base.top, 
                            left: planetPositions[levelId].base.left,
                            ... (window.innerWidth >= 768 && planetPositions.md[levelId]) // تطبيق تصميم الكمبيوتر للشاشات الكبيرة
                        }}
                        title={isLocked ? "أكمل المستويات السابقة لفتح هذا الكوكب" : `${level.name} - ${Math.round(progress)}% مكتمل`}
                    >
                        <button
                            onClick={() => !isLocked && handleLevelSelect(levelId)}
                            disabled={isLocked}
                            className={`
                                w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center text-white p-2
                                bg-gradient-to-br ${level.color} transition-all duration-300 transform relative overflow-hidden
                                ${isLocked ? 'grayscale cursor-not-allowed opacity-60' : 'hover:scale-110 hover:shadow-2xl hover:shadow-sky-500/50'}
                                ${isActiveLevel ? 'ring-4 ring-offset-4 ring-sky-300 dark:ring-sky-400 ring-offset-slate-900 animate-pulse-slow' : ''}
                            `}
                        >
                            {isLocked && <Lock className="absolute top-2 right-2 text-white/70" size={16}/>}
                            
                            <div className="absolute inset-0 bg-repeat bg-center opacity-20"
                                 style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}>
                            </div>

                            <span className="text-3xl md:text-4xl font-bold relative">{level.icon}</span>
                            <span className="text-xs md:text-sm font-semibold text-center relative">{level.name}</span>
                            
                            {!isLocked && (
                                <svg className="absolute w-full h-full top-0 left-0 transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="transparent" pathLength="100"/>
                                    <circle cx="50%" cy="50%" r="45%" stroke="white" strokeWidth="5" fill="transparent" strokeDasharray="100"
                                            strokeDashoffset={100 - progress} pathLength="100" className="transition-all duration-700 ease-in-out"/>
                                </svg>
                            )}
                        </button>
                    </div>
                );
            })}

            <style jsx global>{`
                @keyframes path-flow-animation {
                    from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; }
                }
                .animate-path-flow { animation: path-flow-animation 40s linear infinite; }
                .animate-path-flow-desktop { animation: path-flow-animation 60s linear infinite; }
                
                @keyframes pulse-slow-animation {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(56, 189, 248, 0); }
                }
                .animate-pulse-slow { animation: pulse-slow-animation 4s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default CosmicMap;

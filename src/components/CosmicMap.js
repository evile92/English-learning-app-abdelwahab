// src/components/CosmicMap.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, Rocket } from 'lucide-react';

const CosmicMap = () => {
    const {
        initialLevels,
        userLevel,
        handleLevelSelect,
        lessonsDataState
    } = useAppContext();
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];

    // --- (بداية التعديل) ---
    const positions = {
        mobile: { // تصميم الهاتف يبقى كما هو (عمودي)
            A1: { top: '10%', left: '25%' },
            A2: { top: '30%', left: '75%' },
            B1: { top: '50%', left: '25%' },
            B2: { top: '70%', left: '75%' },
            C1: { top: '90%', left: '25%' },
        },
        desktop: { // تم تعديل الإحداثيات لتطابق الرسم الموجي
            A1: { top: '80%', left: '90%' },
            A2: { top: '30%', left: '70%' },
            B1: { top: '80%', left: '50%' },
            B2: { top: '30%', left: '30%' },
            C1: { top: '80%', left: '10%' },
        }
    };
    // --- (نهاية التعديل) ---
    
    const Planet = ({ levelId, positionStyle }) => {
        const level = initialLevels[levelId];
        const levelLessons = lessonsDataState?.[levelId] || [];
        const completedCount = levelLessons.filter(l => l.completed).length;
        const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
        
        const isLocked = !userLevel || (levelOrder.indexOf(levelId) > levelOrder.indexOf(userLevel));
        const isActiveLevel = levelId === userLevel;

        return (
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={positionStyle}
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
                    <div className="absolute inset-0 bg-repeat bg-center opacity-20"
                         style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center">
                        <span className="text-3xl md:text-4xl font-bold">{level.icon}</span>
                        <span className="text-xs md:text-sm font-semibold text-center">{level.name}</span>
                    </div>
                    
                    {!isLocked && (
                        <svg className="absolute w-full h-full top-0 left-0 transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.2)" strokeWidth="5" fill="transparent" pathLength="100"/>
                            <circle cx="50%" cy="50%" r="45%" stroke="white" strokeWidth="5" fill="transparent" strokeDasharray="100"
                                    strokeDashoffset={100 - progress} pathLength="100" className="transition-all duration-700 ease-in-out"/>
                        </svg>
                    )}
                </button>
                
                {isLocked && (
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                        <Lock className="text-white" size={16}/>
                    </div>
                )}
                
                {isActiveLevel && (
                    <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 animate-rocket">
                        <Rocket className="text-white -scale-x-100" size={24}/>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto h-[650px] md:h-[500px] my-8">

            {/* تصميم الهاتف (عمودي) */}
            <div className="md:hidden w-full h-full relative">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 650" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="pathGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M100 65 C 250 130, 250 200, 300 195 C 350 190, 150 260, 100 325 C 50 390, 250 455, 300 455 C 350 455, 150 520, 100 585"
                        stroke="url(#pathGradientMobile)" strokeWidth="3" fill="none" strokeDasharray="10 7"
                        className="animate-path-flow"
                    />
                </svg>
                {levelOrder.map(id => <Planet key={id} levelId={id} positionStyle={positions.mobile[id]} />)}
            </div>

            {/* --- (بداية التعديل) --- */}
            {/* تصميم الكمبيوتر (أفقي ومعدل بالكامل) */}
            <div className="hidden md:block w-full h-full relative">
                 <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="pathGradientDesktop" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 900 400 C 850 400, 800 150, 700 150 C 600 150, 550 400, 500 400 C 450 400, 400 150, 300 150 C 200 150, 150 400, 100 400"
                        stroke="url(#pathGradientDesktop)" strokeWidth="4" fill="none" strokeDasharray="15 10"
                        className="animate-path-flow-desktop"
                    />
                </svg>
                {levelOrder.map(id => <Planet key={id} levelId={id} positionStyle={positions.desktop[id]} />)}
            </div>
            {/* --- (نهاية التعديل) --- */}

            <style jsx global>{`
                @keyframes path-flow-animation { from { stroke-dashoffset: 1000; } to { stroke-dashoffset: 0; } }
                .animate-path-flow { animation: path-flow-animation 40s linear infinite; }
                .animate-path-flow-desktop { animation: path-flow-animation 60s linear infinite; }
                
                @keyframes pulse-slow-animation {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(56, 189, 248, 0); }
                }
                .animate-pulse-slow { animation: pulse-slow-animation 4s ease-in-out infinite; }
                
                @keyframes rocket-float {
                    0%, 100% { transform: translateY(0) rotate(-5deg); }
                    50% { transform: translateY(-5px) rotate(5deg); }
                }
                .animate-rocket { animation: rocket-float 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default CosmicMap;

// src/components/CosmicMap.js

import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Lock, Rocket } from 'lucide-react';

const CosmicMap = () => {
    const {
        initialLevels,
        userLevel,
        handleLevelSelect,
        lessonsDataState,
        isDarkMode
    } = useAppContext();
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1'];

    const positions = {
        mobile: {
            A1: { top: '10%', left: '25%' },
            A2: { top: '30%', left: '75%' },
            B1: { top: '50%', left: '25%' },
            B2: { top: '70%', left: '75%' },
            C1: { top: '90%', left: '25%' },
        },
        desktop: {
            A1: { top: '75%', left: '95%' },
            A2: { top: '25%', left: '75%' },
            B1: { top: '75%', left: '50%' },
            B2: { top: '25%', left: '25%' },
            C1: { top: '75%', left: '5%'  },
        }
    };
    
    const Planet = ({ levelId, positionStyle }) => {
        const level = initialLevels[levelId];
        const levelLessons = lessonsDataState?.[levelId] || [];
        const completedCount = levelLessons.filter(l => l.completed).length;
        const progress = levelLessons.length > 0 ? (completedCount / levelLessons.length) * 100 : 0;
        
        const isLocked = !userLevel || (levelOrder.indexOf(levelId) > levelOrder.indexOf(userLevel));
        const isActiveLevel = levelId === userLevel;

        const rocketPosition = () => {
            const pos = positions.desktop[levelId];
            if (pos.top === '25%') {
                return { top: 'auto', bottom: '-2rem', right: '50%', transform: 'translateX(50%) rotate(90deg)' };
            }
            return { top: '-2rem', bottom: 'auto', right: '50%', transform: 'translateX(50%) rotate(-90deg)' };
        };

        return (
            <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={positionStyle}
                title={isLocked ? "أكمل المستويات السابقة لفتح هذا الكوكب" : `${level.name} - ${Math.round(progress)}% مكتمل`}
            >
                <button
                    onClick={() => !isLocked && handleLevelSelect(levelId)}
                    disabled={isLocked}
                    // --- (بداية التعديل) ---
                    className={`
                        w-28 h-28 md:w-36 md:h-36 rounded-full flex flex-col items-center justify-center text-white p-2
                        ${level.color} transition-all duration-300 transform relative overflow-hidden
                        shadow-lg
                        ${isLocked 
                            ? 'grayscale cursor-not-allowed opacity-70' 
                            : 'hover:scale-110 hover:shadow-2xl hover:shadow-sky-500/50'
                        }
                        ${isActiveLevel 
                            ? `ring-4 ${isDarkMode ? 'ring-sky-400 ring-offset-slate-900' : 'ring-sky-500 ring-offset-sky-100'} ring-offset-4 animate-pulse-slow` 
                            : ''
                        }
                    `}
                    // --- (نهاية التعديل) ---
                >
                    <div className={`absolute inset-0 rounded-full ${isDarkMode ? 'bg-black/20' : 'bg-black/10'}`}></div>
                    <div className="absolute inset-0 bg-repeat bg-center opacity-10"
                         style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')"}}>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-shadow">
                        <span className="text-3xl md:text-4xl font-bold">{level.icon}</span>
                        <span className="text-xs md:text-sm font-semibold text-center">{level.name}</span>
                    </div>
                    
                    {!isLocked && (
                        <svg className="absolute w-full h-full top-0 left-0 transform -rotate-90">
                            <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.3)" strokeWidth="5" fill="transparent" pathLength="100"/>
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
                    <div className="absolute animate-rocket" style={rocketPosition()}>
                        <Rocket className="text-white drop-shadow-lg" size={24}/>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative w-full max-w-6xl mx-auto h-[650px] md:h-[500px] my-8">

            {/* تصميم الهاتف */}
            <div className="md:hidden w-full h-full relative">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 650" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="pathGradientMobile" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={isDarkMode ? '#38bdf8' : '#3b82f6'} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={isDarkMode ? '#f59e0b' : '#fb923c'} stopOpacity="0.5" />
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

            {/* تصميم الكمبيوتر */}
            <div className="hidden md:block w-full h-full relative">
                 <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="pathGradientDesktop" x1="100%" y1="0%" x2="0%" y2="0%">
                            <stop offset="0%" stopColor={isDarkMode ? '#38bdf8' : '#3b82f6'} stopOpacity="0.6" />
                            <stop offset="50%" stopColor={isDarkMode ? '#a78bfa' : '#8b5cf6'} stopOpacity="0.6" />
                            <stop offset="100%" stopColor={isDarkMode ? '#f59e0b' : '#fb923c'} stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                    <path 
                        d="M 950 375 C 900 375, 850 125, 750 125 C 650 125, 550 375, 500 375 C 450 375, 350 125, 250 125 C 150 125, 100 375, 50 375"
                        stroke="url(#pathGradientDesktop)" strokeWidth="4" fill="none" strokeDasharray="15 10"
                        className="animate-path-flow-desktop"
                    />
                </svg>
                {levelOrder.map(id => <Planet key={id} levelId={id} positionStyle={positions.desktop[id]} />)}
            </div>

            <style jsx global>{`
                .text-shadow {
                    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.4);
                }
                @keyframes path-flow-animation { from { stroke-dashoffset: 2500; } to { stroke-dashoffset: 0; } }
                .animate-path-flow { animation: path-flow-animation 40s linear infinite; }
                .animate-path-flow-desktop { animation: path-flow-animation 80s linear infinite; }
                
                @keyframes pulse-slow-animation {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(56, 189, 248, 0); }
                }
                .animate-pulse-slow { animation: pulse-slow-animation 4s ease-in-out infinite; }
                
                @keyframes rocket-float {
                    0%, 100% { transform: var(--tw-transform) translateY(0); }
                    50% { transform: var(--tw-transform) translateY(-5px); }
                }
                .animate-rocket { animation: rocket-float 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default CosmicMap;

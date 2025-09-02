import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function AchievementPopup() {
    const { newlyUnlockedAchievement, setNewlyUnlockedAchievement } = useAppContext();

    if (!newlyUnlockedAchievement) return null;

    return (
        <div 
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-amber-400 dark:border-amber-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in"
            onClick={() => setNewlyUnlockedAchievement(null)}
        >
            <p className="text-sm font-semibold text-amber-500">إنجاز جديد!</p>
            <div className="text-7xl my-4">{newlyUnlockedAchievement.emoji}</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{newlyUnlockedAchievement.name}</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-1">{newlyUnlockedAchievement.description}</p>
            <button 
                onClick={() => setNewlyUnlockedAchievement(null)} 
                className="mt-6 w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg"
            >
                رائع!
            </button>
        </div>
    );
}

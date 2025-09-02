import React from 'react';
import { Check } from 'lucide-react';

export default function GoalReachedPopup({ dailyGoal, onClose }) {
    return (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 border border-green-400 dark:border-green-500 rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <Check className="text-green-500" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">أحسنت!</h3>
            <p className="text-slate-600 dark:text-slate-300 mt-1">لقد أكملت هدفك اليومي وهو {dailyGoal} دقيقة من التعلم. استمر في هذا العمل الرائع!</p>
            <button 
                onClick={onClose} 
                className="mt-6 w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-lg"
            >
                إغلاق
            </button>
        </div>
    );
}

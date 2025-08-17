import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressIndicator = ({ lessonsData }) => {
    const completedLessons = Object.values(lessonsData).flat().filter(l => l.completed);
    
    if (completedLessons.length === 0) {
        return (
            <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg">
                <TrendingUp className="text-slate-400" size={24} />
                <span className="font-semibold text-slate-500 dark:text-slate-400">مبتدئ</span>
            </div>
        );
    }

    const totalStars = completedLessons.reduce((sum, lesson) => sum + lesson.stars, 0);
    const averageStars = totalStars / completedLessons.length;

    let level = { text: 'استمر بالمحاولة', color: 'text-amber-500' };
    if (averageStars > 2.7) {
        level = { text: 'ممتاز', color: 'text-green-500' };
    } else if (averageStars > 2.0) {
        level = { text: 'رائع', color: 'text-sky-500' };
    } else if (averageStars > 1.5) {
        level = { text: 'جيد', color: 'text-lime-500' };
    }

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-2 shadow-lg">
            <TrendingUp className={level.color} size={24} />
            <span className={`font-bold text-lg ${level.color}`}>{level.text}</span>
        </div>
    );
};

export default ProgressIndicator;

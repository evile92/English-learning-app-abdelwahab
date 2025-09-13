// src/components/ActivityMap.js
import React from 'react';

const ActivityMap = ({ activityData }) => {
    // Generate dates for the last 6 months (approx 182 days for even weeks)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 182);

    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Create a map for quick lookup of activity
    const activityMap = new Map();
    if (activityData) {
        activityData.forEach(dateStr => {
            // Ensure the date is valid before processing
            if (dateStr && !isNaN(new Date(dateStr))) {
                const date = new Date(dateStr).toDateString();
                activityMap.set(date, (activityMap.get(date) || 0) + 1);
            }
        });
    }

    const getColorClass = (count) => {
        if (count === 0) return 'bg-slate-200 dark:bg-slate-700/50';
        if (count <= 2) return 'bg-sky-200 dark:bg-sky-900';
        if (count <= 5) return 'bg-sky-400 dark:bg-sky-700';
        return 'bg-sky-600 dark:bg-sky-500';
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">خريطة النشاط</h2>
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-lg">
                {/* ✅ الكود الصحيح للشبكة */}
                <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                    {dates.map(date => {
                        const activityCount = activityMap.get(date.toDateString()) || 0;
                        const dateString = date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric', numberingSystem: 'latn' });
                        const title = activityCount > 0
                            ? `${activityCount} نشاط في يوم ${dateString}`
                            : `لا يوجد نشاط في يوم ${dateString}`;
                        
                        return (
                            <div
                                key={date.toISOString()}
                                className={`aspect-square rounded-sm ${getColorClass(activityCount)}`}
                                title={title}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-end items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>أقل</span>
                    <div className="w-3 h-3 rounded-sm bg-slate-200 dark:bg-slate-700/50"></div>
                    <div className="w-3 h-3 rounded-sm bg-sky-200 dark:bg-sky-900"></div>
                    <div className="w-3 h-3 rounded-sm bg-sky-400 dark:bg-sky-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-sky-600 dark:bg-sky-500"></div>
                    <span>أكثر</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityMap;

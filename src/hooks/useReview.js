// src/hooks/useReview.js

import { useState, useMemo, useCallback } from 'react';
import { lessonTitles } from '../data/lessons';

export const useReview = (userData, updateUserData) => {
    const [reviewItems, setReviewItems] = useState([]);
    
    useMemo(() => {
        if (!userData?.reviewSchedule) {
            setReviewItems([]);
            return;
        }
        const today = new Date().toISOString().split('T')[0];
        const dueItems = [];
        const allLessonsList = Object.entries(lessonTitles).flatMap(([level, titles]) =>
            titles.map((title, i) => ({ id: `${level}-${i + 1}`, title }))
        );

        for (const lessonId in userData.reviewSchedule.lessons) {
            if (userData.reviewSchedule.lessons[lessonId].nextReviewDate <= today) {
                const lessonInfo = allLessonsList.find(l => l.id === lessonId);
                if (lessonInfo) dueItems.push({ ...lessonInfo, type: 'lesson' });
            }
        }
        for (const wordEn in userData.reviewSchedule.vocabulary) {
            if (userData.reviewSchedule.vocabulary[wordEn].nextReviewDate <= today) {
                const wordInfo = (userData.myVocabulary || []).find(v => v.en === wordEn);
                if (wordInfo) dueItems.push({ ...wordInfo, type: 'vocabulary' });
            }
        }
        setReviewItems(dueItems);
    }, [userData]);

    const getNextReviewDate = (currentLevel = 0) => {
        const intervals = [1, 3, 7, 14, 30, 60, 120];
        const nextLevel = Math.min(currentLevel, intervals.length - 1);
        const date = new Date();
        date.setDate(date.getDate() + intervals[nextLevel]);
        return date.toISOString().split('T')[0];
    };
    
    const handleUpdateReviewItem = useCallback(async (item, wasCorrect) => {
        if (!userData) return;
        const itemType = item.type === 'lesson' ? 'lessons' : 'vocabulary';
        const itemId = item.type === 'lesson' ? item.id : item.en;
        
        const schedule = userData.reviewSchedule;
        if (!schedule || !schedule[itemType] || !schedule[itemType][itemId]) return;
        
        const currentLevel = schedule[itemType][itemId].level || 0;
        const newLevel = wasCorrect ? currentLevel + 1 : 0;
        const nextDate = getNextReviewDate(newLevel);
        
        await updateUserData({
            [`reviewSchedule.${itemType}.${itemId}`]: { level: newLevel, nextReviewDate: nextDate }
        });

    }, [userData, updateUserData]);

    return { reviewItems, handleUpdateReviewItem };
};

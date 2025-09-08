// src/hooks/useGamification.js

import { useState, useEffect, useCallback } from 'react';
import { usePersistentState } from './usePersistentState';
import { achievementsList } from '../data/achievements';
import { arrayUnion } from 'firebase/firestore';

export const useGamification = (user, userData, updateUserData) => {
    const [streakData, setStreakData] = usePersistentState('stellarSpeakStreakData', { count: 0, lastVisit: null });
    const [dailyGoal, setDailyGoal] = usePersistentState('stellarSpeakDailyGoal', 10);
    const [timeSpent, setTimeSpent] = usePersistentState('stellarSpeakTimeSpent', { time: 0, date: new Date().toDateString() });
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);

    useEffect(() => {
        // ... (منطق سلسلة الدخول كما هو)
    }, [streakData, setStreakData]);
    
    const checkAndAwardAchievements = useCallback(async () => {
        // ... (منطق منح الشارات كما هو)
    }, [user, userData, streakData, updateUserData, setNewlyUnlockedAchievement]);

    useEffect(() => {
        if (user && userData) {
            checkAndAwardAchievements();
        }
    }, [user, userData, checkAndAwardAchievements]);

    const handleSetDailyGoal = useCallback(async (minutes) => {
        setDailyGoal(minutes);
        if (user) {
            await updateUserData({ dailyGoal: minutes });
        }
    }, [user, setDailyGoal, updateUserData]);

    return {
        streakData,
        dailyGoal,
        handleSetDailyGoal,
        timeSpent,
        setTimeSpent,
        newlyUnlockedAchievement,
        setNewlyUnlockedAchievement
    };
};

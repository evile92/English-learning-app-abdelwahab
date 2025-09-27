// src/hooks/useGamification.js

import { useState, useEffect, useCallback } from 'react';
import { achievementsList } from '../data/achievements';
import { arrayUnion } from 'firebase/firestore';

export const useGamification = (user, userData, updateUserData) => {
    const [dailyGoal, setDailyGoal] = useState(10);
    const [timeSpent, setTimeSpent] = useState({ time: 0, date: new Date().toDateString() });
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);

    const streakData = userData?.streakData || { count: 0, lastVisit: null };

    // --- بداية الكود المعدل والنهائي ---
    useEffect(() => {
        // لا تفعل شيئاً إذا لم يكن المستخدم مسجلاً أو لا توجد بيانات
        if (!user || !userData?.streakData) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // تجاهل الوقت للتركيز على اليوم فقط

        const lastVisitStr = userData.streakData.lastVisit;
        
        // الحالة الأولى: مستخدم جديد (لا يوجد تاريخ زيارة سابق)
        if (!lastVisitStr) {
            updateUserData({
                streakData: { count: 1, lastVisit: today.toISOString().split('T')[0] }
            });
            return; // توقف هنا
        }

        const lastVisitDate = new Date(lastVisitStr);
        lastVisitDate.setHours(0, 0, 0, 0);

        // الحالة الثانية: المستخدم زار الموقع اليوم بالفعل، لا تفعل شيئاً
        if (today.getTime() === lastVisitDate.getTime()) {
            return; // توقف هنا
        }

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // الحالة الثالثة: آخر زيارة كانت بالأمس، قم بزيادة العداد
        if (yesterday.getTime() === lastVisitDate.getTime()) {
            updateUserData({
                'streakData.count': (userData.streakData.count || 0) + 1,
                'streakData.lastVisit': today.toISOString().split('T')[0]
            });
        }
        // الحالة الرابعة: المستخدم غاب لأكثر من يوم، أعد تعيين العداد
        else {
            updateUserData({
                streakData: { count: 1, lastVisit: today.toISOString().split('T')[0] }
            });
        }

    }, [user, userData, updateUserData]);
    // --- نهاية الكود المعدل والنهائي ---
    

    const checkAndAwardAchievements = useCallback(async () => {
        if (!user || !userData || !userData.lessonsData) return;

        const unlocked = userData.unlockedAchievements || [];
        const achievementsToUpdate = [];

        const allLessons = Object.values(userData.lessonsData).flat();
        const completedLessons = allLessons.filter(l => l.completed);
        const perfectLessons = completedLessons.filter(l => l.stars === 3).length;

        const award = (achievementId) => {
            if (!unlocked.includes(achievementId)) {
                setNewlyUnlockedAchievement(achievementsList[achievementId]);
                achievementsToUpdate.push(achievementId);
            }
        };

        if (completedLessons.length >= 1) {
            award('FIRST_LESSON');
        }

        if (streakData.count >= 7) {
            award('STREAK_7_DAYS');
        }
        
        if (streakData.count >= 30) {
            award('STREAK_30_DAYS');
        }

        const a1Lessons = userData.lessonsData.A1 || [];
        if (a1Lessons.length > 0 && a1Lessons.every(l => l.completed)) {
            award('LEVEL_A1_COMPLETE');
        }
        
        if (perfectLessons >= 10) {
            award('TEN_PERFECT_LESSONS');
        }

        const lessonsPerLevel = {};
        completedLessons.forEach(l => {
            const level = l.id.substring(0, 2);
            lessonsPerLevel[level] = (lessonsPerLevel[level] || 0) + 1;
        });
        if (Object.values(lessonsPerLevel).some(count => count >= 5)) {
            award('FIVE_LESSONS_IN_LEVEL');
        }

        if (userData.earnedCertificates && userData.earnedCertificates.length > 0) {
            award('FIRST_EXAM_PASSED');
        }
        
        if (userData.myVocabulary && userData.myVocabulary.length >= 10) {
            award('SAVE_10_WORDS');
        }
        
        if (userData.level === 'B1' || userData.level === 'B2' || userData.level === 'C1') {
            award('LEVEL_B1_REACHED');
        }
        
        if (achievementsToUpdate.length > 0) {
            await updateUserData({
                unlockedAchievements: arrayUnion(...achievementsToUpdate)
            });
        }
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

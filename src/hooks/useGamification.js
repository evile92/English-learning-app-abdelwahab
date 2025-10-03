// src/hooks/useGamification.js - الإصدار المحسن للشارات

import { useState, useEffect, useCallback, useRef } from 'react';
import { achievementsList } from '../data/achievements';
import { arrayUnion } from 'firebase/firestore';

export const useGamification = (user, userData, updateUserData) => {
    const dailyGoal = userData?.dailyGoal || 10;
    const [timeSpent, setTimeSpent] = useState({ time: 0, date: new Date().toDateString() });
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);

    // ✅ لمنع الحلقة اللا نهائية في الـ streak
    const hasUpdatedToday = useRef(false);
    const lastProcessedDate = useRef(null);
    
    // ✅ لتجنب التحقق المتكرر من الشارات
    const lastCheckedAchievements = useRef({});
    const isCheckingAchievements = useRef(false);

    const streakData = userData?.streakData || { count: 0, lastVisit: null };

    // كود الـ streak المحسن (نفس الكود السابق)
    useEffect(() => {
        if (!user || !userData?.streakData) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayString = today.toISOString().split('T')[0];

        if (lastProcessedDate.current === todayString) {
            return;
        }

        const lastVisitStr = userData.streakData.lastVisit;
        
        if (!lastVisitStr) {
            updateUserData({
                streakData: { count: 1, lastVisit: todayString }
            });
            lastProcessedDate.current = todayString;
            return;
        }

        if (lastVisitStr === todayString) {
            lastProcessedDate.current = todayString;
            return;
        }

        const lastVisitDate = new Date(lastVisitStr);
        lastVisitDate.setHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        if (yesterday.getTime() === lastVisitDate.getTime()) {
            updateUserData({
                'streakData.count': (userData.streakData.count || 0) + 1,
                'streakData.lastVisit': todayString
            });
        } else {
            updateUserData({
                streakData: { count: 1, lastVisit: todayString }
            });
        }

        lastProcessedDate.current = todayString;

    }, [user]);

    // ✅ نظام شارات محسن مع تجنب التحقق المتكرر
    const checkAndAwardAchievements = useCallback(async () => {
        if (!user || !userData || !userData.lessonsData || isCheckingAchievements.current) return;

        // ✅ إنشاء مفتاح فريد لحالة البيانات الحالية
        const dataKey = JSON.stringify({
            lessonsCount: Object.values(userData.lessonsData).flat().filter(l => l.completed).length,
            streakCount: streakData.count,
            vocabularyCount: userData.myVocabulary?.length || 0,
            certificatesCount: userData.earnedCertificates?.length || 0,
            unlockedCount: userData.unlockedAchievements?.length || 0
        });

        // ✅ إذا لم تتغير البيانات، لا تتحقق من الشارات
        if (lastCheckedAchievements.current.dataKey === dataKey) {
            return;
        }

        isCheckingAchievements.current = true;

        try {
            const unlocked = userData.unlockedAchievements || [];
            const achievementsToUpdate = [];

            // ✅ حساب محسن للبيانات
            const allLessons = Object.values(userData.lessonsData).flat();
            const completedLessons = allLessons.filter(l => l.completed);
            const perfectLessons = completedLessons.filter(l => l.stars === 3);

            const award = (achievementId) => {
                if (!unlocked.includes(achievementId)) {
                    setNewlyUnlockedAchievement(achievementsList[achievementId]);
                    achievementsToUpdate.push(achievementId);
                }
            };

            // ✅ فحص الشارات بكفاءة
            const checks = [
                { condition: completedLessons.length >= 1, achievement: 'FIRST_LESSON' },
                { condition: streakData.count >= 7, achievement: 'STREAK_7_DAYS' },
                { condition: streakData.count >= 30, achievement: 'STREAK_30_DAYS' },
                { condition: perfectLessons.length >= 10, achievement: 'TEN_PERFECT_LESSONS' },
                { condition: (userData.myVocabulary?.length || 0) >= 10, achievement: 'SAVE_10_WORDS' },
                { condition: (userData.earnedCertificates?.length || 0) > 0, achievement: 'FIRST_EXAM_PASSED' }
            ];

            checks.forEach(({ condition, achievement }) => {
                if (condition) award(achievement);
            });

            // ✅ فحص مستوى A1
            const a1Lessons = userData.lessonsData.A1 || [];
            if (a1Lessons.length > 0 && a1Lessons.every(l => l.completed)) {
                award('LEVEL_A1_COMPLETE');
            }

            // ✅ فحص 5 دروس في مستوى
            const lessonsPerLevel = {};
            completedLessons.forEach(l => {
                const level = l.id.substring(0, 2);
                lessonsPerLevel[level] = (lessonsPerLevel[level] || 0) + 1;
            });
            if (Object.values(lessonsPerLevel).some(count => count >= 5)) {
                award('FIVE_LESSONS_IN_LEVEL');
            }

            // ✅ فحص المستوى المتقدم
            if (['B1', 'B2', 'C1'].includes(userData.level)) {
                award('LEVEL_B1_REACHED');
            }

            // ✅ تحديث الشارات إذا وُجدت شارات جديدة
            if (achievementsToUpdate.length > 0) {
                await updateUserData({
                    unlockedAchievements: arrayUnion(...achievementsToUpdate)
                });
                
                console.log(`🏆 تم منح ${achievementsToUpdate.length} شارة جديدة:`, achievementsToUpdate);
            }

            // ✅ تحديث مفتاح آخر فحص
            lastCheckedAchievements.current = { dataKey, timestamp: Date.now() };

        } catch (error) {
            console.error('خطأ في فحص الشارات:', error);
        } finally {
            isCheckingAchievements.current = false;
        }
    }, [user, userData, streakData, updateUserData]);

    // ✅ تشغيل فحص الشارات فقط عند التغييرات المهمة
    useEffect(() => {
        if (user && userData && userData.lessonsData) {
            // تأخير بسيط لتجنب الاستدعاءات المتعددة
            const timer = setTimeout(() => {
                checkAndAwardAchievements();
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [user, userData?.lessonsData, streakData.count, userData?.myVocabulary?.length, userData?.earnedCertificates?.length]);

    const handleSetDailyGoal = useCallback(async (minutes) => {
        if (user) {
            await updateUserData({ dailyGoal: minutes });
        }
    }, [user, updateUserData]);

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

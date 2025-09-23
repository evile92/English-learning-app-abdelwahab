// src/hooks/useGamification.js

import { useState, useEffect, useCallback } from 'react';
import { achievementsList } from '../data/achievements';
import { arrayUnion } from 'firebase/firestore';

export const useGamification = (user, userData, updateUserData) => {
    // لا يوجد تغيير هنا
    const [dailyGoal, setDailyGoal] = useState(10);
    const [timeSpent, setTimeSpent] = useState({ time: 0, date: new Date().toDateString() });
    const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState(null);

    // ✅ تم تعديل هذا الجزء بالكامل
    // streakData سيتم جلبه الآن مباشرة من بيانات المستخدم في Firestore
    const streakData = userData?.streakData || { count: 0, lastVisit: null };

    // --- بداية الكود الجديد والمُحسَّن: منطق سلسلة الدخول ---
    useEffect(() => {
        if (!user || !userData?.streakData) return;

        const today = new Date();
        // تجاهل الوقت، نحن نهتم باليوم فقط
        today.setHours(0, 0, 0, 0); 

        const lastVisitDate = userData.streakData.lastVisit 
            ? new Date(userData.streakData.lastVisit) 
            : null;
        
        if (lastVisitDate) {
            lastVisitDate.setHours(0, 0, 0, 0);
        }

        // إذا كانت آخر زيارة هي اليوم، لا تفعل شيئًا
        if (lastVisitDate && today.getTime() === lastVisitDate.getTime()) {
            return;
        }

        let newStreakCount = userData.streakData.count || 0;
        let shouldUpdate = false;

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        // إذا كانت آخر زيارة بالأمس، قم بزيادة العداد
        if (lastVisitDate && yesterday.getTime() === lastVisitDate.getTime()) {
            newStreakCount++;
            shouldUpdate = true;
            console.log("Streak continued! New count:", newStreakCount); // رسالة للتجربة
        } 
        // إذا لم تكن الزيارة اليوم أو بالأمس، أعد تعيين العداد إلى 1
        else {
            newStreakCount = 1;
            shouldUpdate = true;
            console.log("Streak reset to 1."); // رسالة للتجربة
        }

        if (shouldUpdate) {
            updateUserData({
                streakData: {
                    count: newStreakCount,
                    // حفظ تاريخ اليوم كتاريخ لآخر زيارة
                    lastVisit: today.toISOString().split('T')[0] 
                }
            });
        }

    }, [user, userData, updateUserData]);
    // --- نهاية الكود الجديد ---
    

    // --- بداية الكود الجديد: منطق منح الشارات ---
    const checkAndAwardAchievements = useCallback(async () => {
        if (!user || !userData || !userData.lessonsData) return;

        const unlocked = userData.unlockedAchievements || [];
        const achievementsToUpdate = [];

        const allLessons = Object.values(userData.lessonsData).flat();
        const completedLessons = allLessons.filter(l => l.completed);
        const perfectLessons = completedLessons.filter(l => l.stars === 3).length;

        // دالة مساعدة لتجنب التكرار
        const award = (achievementId) => {
            if (!unlocked.includes(achievementId)) {
                setNewlyUnlockedAchievement(achievementsList[achievementId]);
                achievementsToUpdate.push(achievementId);
            }
        };

        // 1. المستكشف الصغير: أكملت أول درس لك
        if (completedLessons.length >= 1) {
            award('FIRST_LESSON');
        }

        // 2. المثابر: حافظت على سلسلة دخول لمدة 7 أيام
        if (streakData.count >= 7) {
            award('STREAK_7_DAYS');
        }
        
        // 3. أسطورة الالتزام: حافظت على سلسلة دخول لمدة 30 يوماً
        if (streakData.count >= 30) {
            award('STREAK_30_DAYS');
        }

        // 4. خبير الأساسيات: أتقنت كل دروس المستوى الأول A1
        const a1Lessons = userData.lessonsData.A1 || [];
        if (a1Lessons.length > 0 && a1Lessons.every(l => l.completed)) {
            award('LEVEL_A1_COMPLETE');
        }
        
        // 5. النجم الساطع: حصلت على 3 نجوم في 10 دروس
        if (perfectLessons >= 10) {
            award('TEN_PERFECT_LESSONS');
        }

        // 6. بداية قوية: أكملت 5 دروس في مستوى واحد
        const lessonsPerLevel = {};
        completedLessons.forEach(l => {
            const level = l.id.substring(0, 2);
            lessonsPerLevel[level] = (lessonsPerLevel[level] || 0) + 1;
        });
        if (Object.values(lessonsPerLevel).some(count => count >= 5)) {
            award('FIVE_LESSONS_IN_LEVEL');
        }

        // 7. متجاوز العقبات: نجحت في أول امتحان نهائي
        if (userData.earnedCertificates && userData.earnedCertificates.length > 0) {
            award('FIRST_EXAM_PASSED');
        }
        
        // 8. جامع الكلمات: أضفت 10 كلمات جديدة إلى قاموسك
        if (userData.myVocabulary && userData.myVocabulary.length >= 10) {
            award('SAVE_10_WORDS');
        }
        
        // 9. نجم السديم: وصلت إلى سديم المتوسطين (المستوى B1)
        if (userData.level === 'B1' || userData.level === 'B2' || userData.level === 'C1') {
            award('LEVEL_B1_REACHED');
        }
        
        // ... يمكنك إضافة بقية الشارات هنا بنفس الطريقة ...

        // تحديث قاعدة البيانات دفعة واحدة إذا كانت هناك شارات جديدة
        if (achievementsToUpdate.length > 0) {
            await updateUserData({
                unlockedAchievements: arrayUnion(...achievementsToUpdate)
            });
        }
    }, [user, userData, streakData, updateUserData, setNewlyUnlockedAchievement]);
    // --- نهاية الكود الجديد: منطق منح الشارات ---


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

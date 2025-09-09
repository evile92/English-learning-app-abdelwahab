// src/hooks/useUserData.js

import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { initialLessonsData } from '../data/lessons';

// --- ✅ تم التعديل: إضافة setPage كمعامل لاستخدامه في الدالة الجديدة ---
export const useUserData = (user, setPage) => {
    const [userData, setUserData] = useState(null);
    const [isSyncing, setIsSyncing] = useState(true);

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setUserData(null);
            setIsSyncing(false);
            return;
        }
        
        setIsSyncing(true);
        const userDocRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                setUserData(userDoc.data());
            } else {
                console.warn("User document does not exist for UID:", user.uid);
                setUserData(null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            setUserData(null);
        } finally {
            setIsSyncing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    const updateUserData = useCallback(async (updates) => {
        if (!user) return;
        const userDocRef = doc(db, "users", user.uid);
        try {
            await updateDoc(userDocRef, updates);
            // تحديث الحالة المحلية فوراً لتجربة مستخدم أسرع
            setUserData(prevData => ({ ...prevData, ...updates }));
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    }, [user]);

    // --- ✅ تمت الإضافة: تعريف الدالة المفقودة التي سيتم استدعاؤها بعد الاختبار ---
    const handleTestComplete = useCallback(async (level) => {
        if (!user) {
             console.error("Cannot complete test: No user is signed in.");
             // يمكنك هنا عرض رسالة للمستخدم تطلب منه تسجيل الدخول أولاً
             return;
        }
        try {
            // تحديث مستوى المستخدم في قاعدة البيانات
            await updateUserData({ level: level });
            // الانتقال إلى شاشة إدخال الاسم بعد التحديث الناجح
            if (setPage) {
                setPage('nameEntry');
            }
        } catch (error) {
            console.error("Error finalizing placement test:", error);
        }
    }, [user, updateUserData, setPage]);
    // --- ✅ نهاية الإضافة ---

    // استخراج بيانات محددة وتوفير قيم افتراضية لتجنب الأخطاء
    const lessonsDataState = userData?.lessonsData || initialLessonsData;
    const userLevel = userData?.level || null;
    const userName = userData?.username || '';
    const myVocabulary = userData?.myVocabulary || [];
    const errorLog = userData?.errorLog || [];
    const reviewSchedule = userData?.reviewSchedule || { lessons: {}, vocabulary: {} };

    return { 
        userData, 
        isSyncing, 
        fetchUserData,
        updateUserData,
        lessonsDataState,
        userLevel,
        userName,
        myVocabulary,
        errorLog,
        reviewSchedule,
        handleTestComplete // --- ✅ إضافة الدالة إلى الكائن المُرجع لتكون متاحة في التطبيق ---
    };
};
